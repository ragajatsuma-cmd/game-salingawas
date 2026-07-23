"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Boxes,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDashed,
  ClipboardCheck,
  Clock3,
  Download,
  Eye,
  FileQuestion,
  Flag,
  FolderKanban,
  Gamepad2,
  Gauge,
  Home,
  ImageIcon,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  MapPinned,
  MessageSquareText,
  MoreHorizontal,
  Radio,
  RefreshCcw,
  Search,
  Settings,
  ShieldAlert,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Upload,
  Users,
  X,
} from "lucide-react";
import type { ElementType } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { badges, buildings, codexEntries, missions, npcs, questions } from "@/lib/game-content";

type Section = "overview" | "users" | "content" | "contributions" | "assets" | "analytics" | "control";
type ContentTab = "buildings" | "npcs" | "missions" | "questions" | "badges" | "codex" | "endings";

interface AdminDashboardProps {
  serverStats: { runs: number; answers: number; pending: number };
  serverContributions: Array<{
    id: string;
    guestAlias: string | null;
    contributionType: string;
    title: string;
    scenarioText: string;
    proposedReasoning: string | null;
    sources: string | null;
    status: string;
    createdAt: string;
  }>;
  serverUsers: Array<{
    id: string;
    displayName: string;
    region: string | null;
    role: string;
    createdAt: string;
  }>;
}

const sectionConfig: Array<[Section, typeof LayoutDashboard, string]> = [
  ["overview", LayoutDashboard, "Overview"],
  ["users", Users, "Pengguna"],
  ["content", FolderKanban, "Content manager"],
  ["contributions", MessageSquareText, "Kontribusi"],
  ["assets", ImageIcon, "Asset manager"],
  ["analytics", BarChart3, "Analytics"],
  ["control", Settings, "Global control"],
];

const contentTabs: Array<[ContentTab, string, typeof Boxes]> = [
  ["buildings", "Bangunan", Boxes],
  ["npcs", "NPC", Users],
  ["missions", "Misi", Flag],
  ["questions", "Pertanyaan", FileQuestion],
  ["badges", "Badge", Sparkles],
  ["codex", "Codex", BookOpenCheck],
  ["endings", "Ending", Trophy],
];

export default function AdminDashboard({ serverStats, serverContributions, serverUsers }: AdminDashboardProps) {
  const [section, setSection] = useState<Section>("overview");
  const [contentTab, setContentTab] = useState<ContentTab>("buildings");
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportToken, setExportToken] = useState("");
  const [exportStatus, setExportStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [confirm, setConfirm] = useState<{ title: string; message: string; danger: boolean; onConfirm: () => void } | null>(null);
  const [localContributions, setLocalContributions] = useState(serverContributions);
  const [featureFlags, setFeatureFlags] = useState({
    leaderboard: false,
    contributions: true,
    payment: false,
    challenge: false,
    hiddenScenarios: false,
    advancedEndings: false,
  });
  const [maintMode, setMaintMode] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const contentRows = [
    { label: "Bangunan", count: buildings.length, target: 10, icon: Boxes, state: "Lengkap", color: "#4d9364" },
    { label: "NPC kanonik", count: npcs.length, target: 26, icon: Users, state: "Lengkap", color: "#4d9364" },
    { label: "Misi inti", count: missions.length, target: 26, icon: Flag, state: "Perlu review", color: "#d48a27" },
    { label: "Bank pertanyaan", count: questions.length, target: 60, icon: FileQuestion, state: "Target tercapai", color: "#4d9364" },
    { label: "Badge", count: badges.length, target: 15, icon: Sparkles, state: "Lengkap", color: "#4d9364" },
    { label: "Codex", count: codexEntries.length, target: 11, icon: BookOpenCheck, state: "Lengkap", color: "#4d9364" },
  ];

  const moderateContribution = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch(`/api/contributions/${id}/moderate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error("Gagal memoderasi.");
      setLocalContributions((prev) => prev.map((c) => c.id === id ? { ...c, status: action === "approve" ? "approved" : "rejected" } : c));
    } catch { /* silently fail for prototype */ }
  };

  const doExport = async () => {
    if (!exportToken) return;
    setExportStatus("loading");
    try {
      const res = await fetch(`/api/admin/export-content?format=json`, { headers: { Authorization: `Bearer ${exportToken}` } });
      if (!res.ok) throw new Error("Export gagal. Periksa token.");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "game-content.json"; a.click();
      URL.revokeObjectURL(url);
      setExportStatus("done");
    } catch { setExportStatus("error"); }
  };

  const renderOverview = () => (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><span className="eyebrow">Overview</span><h2 className="mt-2 text-2xl font-black tracking-[-.03em] text-[#214b35] sm:text-3xl">Selamat datang, Raga.</h2><p className="mt-2 text-xs text-[#738178]">Pantau kesehatan konten dan run pembelajaran dari satu tempat.</p></div>
        <div className="flex gap-2"><button className="button-secondary !min-h-10 !rounded-xl !px-4 text-xs" onClick={() => setShowExport(true)}><Download size={15} /> Export konten</button><button className="button-primary !min-h-10 !rounded-xl !px-4 text-xs" onClick={() => { setSection("content"); setShowCreate(true); }}><Sparkles size={15} /> Konten baru</button></div>
      </div>
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#efd2a6] bg-[#fff4df] p-4 text-[#79542e]"><ShieldAlert className="mt-0.5 shrink-0" size={19} /><div><strong className="block text-xs">Mode keamanan prototype</strong><p className="mt-1 text-[10px] leading-5 text-[#79542e]">Path rahasia bukan kontrol keamanan. Hubungkan OAuth, role validation, RLS, rate limiting, dan audit session sebelum produksi.</p></div></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {([[Gamepad2, serverStats.runs, "Total run", "Data server"], [ClipboardCheck, serverStats.answers, "Jawaban dikomit", "Idempotent"], [MessageSquareText, localContributions.filter((c) => c.status === "pending").length, "Kontribusi pending", "Perlu moderasi"], [Activity, 0, "Run tervalidasi", "Leaderboard"]] as const).map(([Icon, value, label, sub]) => <article key={String(label)} className="rounded-2xl border border-[#dde4db] bg-white p-5 shadow-[0_8px_24px_rgba(33,70,48,.04)]"><div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e6f1df] text-[#4b8041]"><Icon size={19} /></span><MoreHorizontal size={17} className="text-[#a3ada6]" /></div><strong className="mt-5 block text-2xl font-black text-[#243f31]">{String(value)}</strong><span className="mt-1 block text-[11px] font-extrabold">{String(label)}</span><small className="mt-1 block text-[9px] text-[#86918a]">{String(sub)}</small></article>)}
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="overflow-hidden rounded-2xl border border-[#dde4db] bg-white shadow-[0_8px_24px_rgba(33,70,48,.04)]">
          <div className="flex items-center justify-between border-b border-[#e4e9e2] px-5 py-4"><div><h3 className="text-sm font-black text-[#294737]">Kesehatan konten</h3><p className="mt-1 text-[9px] text-[#839088]">Cakupan baseline terhadap target prototype</p></div><button className="flex items-center gap-1 text-[9px] font-black text-[#567f4c]" onClick={() => setSection("content")}>Buka manager <ChevronRight size={13} /></button></div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left"><thead className="bg-[#f6f7f4] text-[8px] font-black tracking-wider text-[#829087] uppercase"><tr><th className="px-5 py-3">Koleksi</th><th className="px-5 py-3">Cakupan</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Aksi</th></tr></thead>
            <tbody>{contentRows.map((row) => <tr key={row.label} className="border-t border-[#edf0eb]"><td className="px-5 py-4"><span className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#edf2e9] text-[#58784f]"><row.icon size={17} /></span><strong className="text-[11px]">{row.label}</strong></span></td><td className="px-5 py-4"><div className="flex items-center gap-3"><strong className="w-12 text-[11px]">{row.count}/{row.target}</strong><span className="h-1.5 w-24 overflow-hidden rounded-full bg-[#e5e9e3]"><span className="block h-full rounded-full bg-[#6d9d58]" style={{ width: `${Math.min(100, (row.count / row.target) * 100)}%` }} /></span></div></td><td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] font-black" style={{ color: row.color, background: `${row.color}14` }}>{row.count >= row.target ? <CheckCircle2 size={11} /> : <CircleDashed size={11} />}{row.state}</span></td><td className="px-5 py-4"><button className="text-[9px] font-extrabold text-[#547a4c]" onClick={() => { setSection("content"); setContentTab(row.label === "Bangunan" ? "buildings" : row.label === "NPC kanonik" ? "npcs" : row.label === "Misi inti" ? "missions" : row.label === "Bank pertanyaan" ? "questions" : row.label === "Badge" ? "badges" : "codex"); }}>Kelola</button></td></tr>)}</tbody></table>
          </div>
        </section>
        <div className="grid gap-5">
          <section className="rounded-2xl border border-[#dde4db] bg-white p-5 shadow-[0_8px_24px_rgba(33,70,48,.04)]"><div className="flex items-center justify-between"><h3 className="text-sm font-black">Quality gates</h3><Gauge size={18} className="text-[#719165]" /></div><div className="mt-5 space-y-4">{[["Relasi konten", "110 / 110 valid", 100, "#4d9364"], ["Validasi hukum", "0 / 26 approved", 0, "#d48a27"], ["Aset final", "1 / 63", 2, "#4a90e2"], ["Aksesibilitas", "Audit berjalan", 58, "#8e5ac8"]].map(([label, value, width, color]) => <div key={String(label)}><div className="flex justify-between text-[9px]"><strong>{String(label)}</strong><span className="text-[#849088]">{String(value)}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e6eae4]"><div className="h-full rounded-full" style={{ width: `${Number(width)}%`, background: String(color) }} /></div></div>)}</div></section>
          <section className="rounded-2xl bg-[#214b35] p-5 text-white shadow-lg"><div className="flex items-center gap-2"><AlertTriangle size={17} className="text-[#f5ad5e]" /><h3 className="text-sm font-black">Validasi prioritas</h3></div><p className="mt-3 text-[10px] leading-5 text-white/60">26 misi masih berstatus <strong className="text-white/85">needs-review</strong>. Produksi harus berhenti sampai sumber primer dan ahli materi menyetujui konten.</p><button className="mt-4 flex items-center gap-1 text-[9px] font-black text-[#b7dd9f]" onClick={() => setSection("content")}>Lihat antrean <ChevronRight size={12} /></button></section>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <>
      <span className="eyebrow">Pengguna</span><h2 className="mt-2 text-2xl font-black text-[#214b35]">Manajemen pengguna</h2><p className="mt-2 text-xs text-[#738178]">Cari, lihat, dan kelola akun yang terdaftar pada prototype.</p>
      <div className="mt-6 flex items-center gap-3"><div className="relative flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3ada6]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari alias atau asal..." className="h-11 w-full rounded-xl border border-[#dce2d9] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#6d9d58]" /></div></div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#dde4db] bg-white">
        {serverUsers.length > 0 ? <table className="w-full text-left"><thead className="bg-[#f6f7f4] text-[8px] font-black tracking-wider text-[#829087] uppercase"><tr><th className="px-5 py-3">Alias</th><th className="px-5 py-3">Asal</th><th className="px-5 py-3">Peran</th><th className="px-5 py-3">Terdaftar</th></tr></thead>
        <tbody>{serverUsers.filter((u) => !search || u.displayName.toLowerCase().includes(search.toLowerCase()) || (u.region ?? "").toLowerCase().includes(search.toLowerCase())).map((u) => <tr key={u.id} className="border-t border-[#edf0eb] hover:bg-[#f6f8f4]"><td className="px-5 py-4 text-[11px] font-extrabold">{u.displayName}</td><td className="px-5 py-4 text-[11px] text-[#7a887f]">{u.region ?? "—"}</td><td className="px-5 py-4"><span className="rounded-full bg-[#e8f1e2] px-2 py-1 text-[8px] font-black text-[#4e7c48] uppercase">{u.role}</span></td><td className="px-5 py-4 text-[10px] text-[#8a948e]">{new Date(u.createdAt).toLocaleDateString("id-ID")}</td></tr>)}</tbody></table>
        : <div className="flex min-h-[180px] flex-col items-center justify-center p-6 text-center"><Users size={36} className="text-[#b5c3af]" /><strong className="mt-4 text-[#3d5247]">Belum ada pengguna terdaftar</strong><p className="mt-1 text-xs text-[#7a887f]">Pengguna akan muncul setelah login Google aktif.</p></div>}
      </div>
    </>
  );

  const renderContent = () => {
    const items = contentTab === "buildings" ? buildings : contentTab === "npcs" ? npcs : contentTab === "missions" ? missions : contentTab === "questions" ? questions : contentTab === "badges" ? badges : contentTab === "codex" ? codexEntries : [{ id: "sukses-pengawas", name: "Sukses Menjadi Pengawas", accessTier: "free" }, { id: "perlu-pembinaan", name: "Gagal Menjadi Pengawas", accessTier: "free" }];
    const filtered = search ? items.filter((item: Record<string, unknown>) => Object.values(item).some((v) => String(v).toLowerCase().includes(search.toLowerCase()))) : items;
    return (
      <>
        <span className="eyebrow">Content manager</span><h2 className="mt-2 text-2xl font-black text-[#214b35]">Kelola konten pembelajaran</h2><p className="mt-2 text-xs text-[#738178]">CRUD bangunan, NPC, misi, pertanyaan, badge, codex, dan ending.</p>
        <div className="mt-5 flex flex-wrap gap-2">{contentTabs.map(([tab, label, Icon]) => <button key={tab} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-black transition ${contentTab === tab ? "bg-[#214b35] text-white" : "bg-[#edf2e9] text-[#4e7c48] hover:bg-[#dfeeda]"}`} onClick={() => { setContentTab(tab); setSearch(""); }}><Icon size={14} />{label}</button>)}</div>
        <div className="mt-4 flex items-center gap-3"><div className="relative flex-1"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3ada6]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter konten..." className="h-11 w-full rounded-xl border border-[#dce2d9] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#6d9d58]" /></div><button className="button-primary !min-h-10 !rounded-xl !px-4 text-xs" onClick={() => setShowCreate(true)}><Sparkles size={15} /> Tambah {contentTabs.find((t) => t[0] === contentTab)?.[1]}</button></div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#dde4db] bg-white">
          <table className="w-full text-left"><thead className="bg-[#f6f7f4] text-[8px] font-black tracking-wider text-[#829087] uppercase"><tr><th className="px-5 py-3">ID</th><th className="px-5 py-3">Nama / Judul</th><th className="px-5 py-3">Info</th><th className="px-5 py-3">Aksi</th></tr></thead>
          <tbody>{filtered.slice(0, 30).map((item: Record<string, unknown>) => <tr key={String(item.id)} className="border-t border-[#edf0eb] hover:bg-[#f6f8f4]"><td className="px-5 py-3 text-[10px] font-mono text-[#7a8a80]">{String(item.id)}</td><td className="px-5 py-3 text-[11px] font-extrabold">{String(item.name ?? item.title ?? item.shortName)}</td><td className="px-5 py-3 text-[10px] text-[#7a887f]">{String(item.role ?? item.category ?? item.buildingId ?? item.topic ?? item.accessTier ?? "")}</td><td className="px-5 py-3"><button className="text-[9px] font-extrabold text-[#547a4c]" onClick={() => setDetailId(String(item.id))}>Detail</button></td></tr>)}</tbody></table>
          {filtered.length > 30 && <p className="px-5 py-3 text-[10px] text-[#8a948e]">Menampilkan 30 dari {filtered.length} item.</p>}
        </div>
        {detailId && (() => {
          const item = items.find((i) => String(i.id) === detailId) as Record<string, unknown> | undefined;
          if (!item) return null;
          return <div className="fixed inset-0 z-[70] grid place-items-center p-4 bg-[rgb(15_39_28/58%)] backdrop-blur-[5px]" role="dialog" aria-modal="true"><div className="w-full max-w-lg rounded-3xl border-2 border-[#5d4037] bg-[#f9f7f2] p-6 shadow-[0_24px_80px_rgb(0_0_0/36%)]"><div className="flex items-center justify-between"><h3 className="text-lg font-black text-[#214b35]">Detail: {String(item.name ?? item.title ?? item.shortName)}</h3><button className="grid h-9 w-9 place-items-center rounded-xl bg-[#ebece5] text-[#52625a]" onClick={() => setDetailId(null)}><X size={18} /></button></div><div className="mt-4 space-y-3">{Object.entries(item).map(([key, value]) => <div key={key} className="rounded-xl border border-[#e0e5dc] bg-white p-3"><span className="text-[8px] font-black tracking-wider text-[#8a948e] uppercase">{key}</span><p className="mt-1 text-xs text-[#3f5147]">{typeof value === "object" && value !== null ? JSON.stringify(value) : String(value)}</p></div>)}</div><div className="mt-5 flex gap-3"><button className="button-secondary flex-1" onClick={() => setDetailId(null)}>Tutup</button><button className="button-primary flex-1" onClick={() => { setDetailId(null); setShowCreate(true); }}>Edit salinan</button></div></div></div>;
        })()}
        {showCreate && <div className="fixed inset-0 z-[70] grid place-items-center p-4 bg-[rgb(15_39_28/58%)] backdrop-blur-[5px]" role="dialog" aria-modal="true"><div className="w-full max-w-lg rounded-3xl border-2 border-[#5d4037] bg-[#f9f7f2] p-6 shadow-[0_24px_80px_rgb(0_0_0/36%)]"><div className="flex items-center justify-between"><h3 className="text-lg font-black text-[#214b35]">Tambah konten baru</h3><button className="grid h-9 w-9 place-items-center rounded-xl bg-[#ebece5] text-[#52625a]" onClick={() => setShowCreate(false)}><X size={18} /></button></div><p className="mt-3 text-xs text-[#6b7b6f]">Prototype: form berfungsi tetapi tidak mempersistensi ke database. Konten baru akan muncul setelah admin memublikasikannya via backend.</p><div className="mt-5 space-y-4"><label className="block text-[11px] font-extrabold text-[#405448]">ID konten<input className="mt-2 h-11 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm outline-none focus:border-[#679158]" placeholder="Contoh: custom-mission-01" /></label><label className="block text-[11px] font-extrabold text-[#405448]">Nama / judul<input className="mt-2 h-11 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm outline-none focus:border-[#679158]" placeholder="Judul singkat" /></label><label className="block text-[11px] font-extrabold text-[#405448]">Deskripsi<textarea className="mt-2 min-h-20 w-full resize-y rounded-xl border border-[#ced8ce] bg-white p-3 text-sm outline-none focus:border-[#679158]" placeholder="Konteks, prinsip, atau materi pembelajaran" /></label></div><div className="mt-5 flex gap-3"><button className="button-secondary flex-1" onClick={() => setShowCreate(false)}>Batal</button><button className="button-primary flex-1" onClick={() => setShowCreate(false)}>Simpan draft</button></div></div></div>}
      </>
    );
  };

  const renderContributions = () => {
    const pending = localContributions.filter((c) => c.status === "pending");
    const approved = localContributions.filter((c) => c.status === "approved");
    const rejected = localContributions.filter((c) => c.status === "rejected");
    return (
      <>
        <span className="eyebrow">Kontribusi</span><h2 className="mt-2 text-2xl font-black text-[#214b35]">Moderasi kontribusi warga</h2><p className="mt-2 text-xs text-[#738178]">Kontribusi tidak langsung masuk ke game. Admin harus memvalidasi dan memublikasikannya.</p>
        <div className="mt-5 flex gap-2">{[["pending", "Pending", pending.length], ["approved", "Approved", approved.length], ["rejected", "Rejected", rejected.length]].map(([status, label, count]) => <span key={status} className="rounded-xl bg-[#edf2e9] px-3 py-2 text-[10px] font-black text-[#4e7c48]">{label}: {count}</span>)}</div>
        <div className="mt-5 space-y-4">
          {pending.length > 0 ? pending.map((c) => (
            <article key={c.id} className="rounded-2xl border border-[#dde4db] bg-white p-5 shadow-[0_8px_24px_rgba(33,70,48,.04)]">
              <div className="flex items-start justify-between gap-3"><div className="min-w-0"><span className="rounded-full bg-[#fff0dc] px-2 py-1 text-[8px] font-black text-[#c76a21] uppercase">{c.contributionType}</span><h3 className="mt-2 text-sm font-black text-[#214b35]">{c.title}</h3><p className="mt-1 text-[10px] text-[#7a887f]">Oleh {c.guestAlias ?? "anonim"} · {new Date(c.createdAt).toLocaleDateString("id-ID")}</p></div><span className="rounded-full bg-[#fff0dc] px-2 py-1 text-[8px] font-black text-[#c76a21] uppercase">PENDING</span></div>
              <p className="mt-3 text-xs leading-6 text-[#5d6d63]">{c.scenarioText.slice(0, 200)}{c.scenarioText.length > 200 ? "..." : ""}</p>
              {c.proposedReasoning && <p className="mt-2 text-[10px] leading-5 text-[#7a887f]"><strong>Penalaran:</strong> {c.proposedReasoning.slice(0, 150)}...</p>}
              {c.sources && <p className="mt-1 text-[10px] text-[#8a948e]"><strong>Sumber:</strong> {c.sources.slice(0, 100)}</p>}
              <div className="mt-4 flex gap-2"><button className="flex items-center gap-2 rounded-xl bg-[#e4f2df] px-4 py-2 text-[10px] font-black text-[#4d9364]" onClick={() => moderateContribution(c.id, "approve")}><ThumbsUp size={14} /> Approve</button><button className="flex items-center gap-2 rounded-xl bg-[#fde9e6] px-4 py-2 text-[10px] font-black text-[#d94f44]" onClick={() => moderateContribution(c.id, "reject")}><ThumbsDown size={14} /> Reject</button><button className="rounded-xl bg-[#edf2e9] px-4 py-2 text-[10px] font-black text-[#547a4c]" onClick={() => setDetailId(c.id)}>Lihat lengkap</button></div>
            </article>
          )) : <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-[#dde4db] bg-white p-6 text-center"><CheckCircle2 size={36} className="text-[#4d9364]" /><strong className="mt-4 text-[#3d5247]">Tidak ada kontribusi pending</strong><p className="mt-1 text-xs text-[#7a887f]">Kontribusi baru akan muncul setelah warga mengirim ide.</p></div>}
        </div>
        {detailId && (() => {
          const c = localContributions.find((con) => con.id === detailId);
          if (!c) return null;
          return <div className="fixed inset-0 z-[70] grid place-items-center p-4 bg-[rgb(15_39_28/58%)] backdrop-blur-[5px]" role="dialog" aria-modal="true"><div className="w-full max-w-lg rounded-3xl border-2 border-[#5d4037] bg-[#f9f7f2] p-6 shadow-[0_24px_80px_rgb(0_0_0/36%)] game-scrollbar max-h-[90dvh] overflow-auto"><div className="flex items-center justify-between"><h3 className="text-lg font-black text-[#214b35]">{c.title}</h3><button className="grid h-9 w-9 place-items-center rounded-xl bg-[#ebece5] text-[#52625a]" onClick={() => setDetailId(null)}><X size={18} /></button></div><dl className="mt-4 space-y-3">{[["Jenis", c.contributionType], ["Alias", c.guestAlias ?? "anonim"], ["Status", c.status], ["Tanggal", new Date(c.createdAt).toLocaleString("id-ID")], ["Skenario", c.scenarioText], ["Penalaran", c.proposedReasoning ?? "—"], ["Sumber", c.sources ?? "—"]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-[#e0e5dc] bg-white p-3"><dt className="text-[8px] font-black tracking-wider text-[#8a948e] uppercase">{String(label)}</dt><dd className="mt-1 text-xs text-[#3f5147]">{String(value)}</dd></div>)}</dl><div className="mt-5 flex gap-3">{c.status === "pending" && <><button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#e4f2df] py-2 text-[10px] font-black text-[#4d9364]" onClick={() => { moderateContribution(c.id, "approve"); setDetailId(null); }}><ThumbsUp size={14} /> Approve</button><button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#fde9e6] py-2 text-[10px] font-black text-[#d94f44]" onClick={() => { moderateContribution(c.id, "reject"); setDetailId(null); }}><ThumbsDown size={14} /> Reject</button></>}<button className="button-secondary flex-1" onClick={() => setDetailId(null)}>Tutup</button></div></div></div>;
        })()}
      </>
    );
  };

  const renderAssets = () => (
    <>
      <span className="eyebrow">Asset manager</span><h2 className="mt-2 text-2xl font-black text-[#214b35]">Kelola aset visual dan audio</h2><p className="mt-2 text-xs text-[#738178]">Upload file atau input URL eksternal. Semua aset melewati validasi MIME, batas ukuran, dan metadata.</p>
      <div className="mt-5 flex gap-2"><button className="flex items-center gap-2 rounded-xl bg-[#e6f1df] px-4 py-3 text-[10px] font-black text-[#4b8041]" onClick={() => setShowCreate(true)}><Upload size={15} /> Upload file</button><button className="flex items-center gap-2 rounded-xl bg-[#e2eef5] px-4 py-3 text-[10px] font-black text-[#387594]" onClick={() => { setShowCreate(true); setDetailId("url-mode"); }}><Link2 size={15} /> Input URL</button></div>
      <div className="mt-5 flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-[#dde4db] bg-white p-6 text-center"><ImageIcon size={40} className="text-[#b5c3af]" /><strong className="mt-4 text-[#3d5247]">Belum ada aset terdaftar</strong><p className="mt-1 text-xs text-[#7a887f]">Tambah aset via upload atau URL. Aset akan melewati pipeline validasi sebelum dipublikasikan.</p></div>
      {showCreate && <div className="fixed inset-0 z-[70] grid place-items-center p-4 bg-[rgb(15_39_28/58%)] backdrop-blur-[5px]" role="dialog" aria-modal="true"><div className="w-full max-w-lg rounded-3xl border-2 border-[#5d4037] bg-[#f9f7f2] p-6 shadow-[0_24px_80px_rgb(0_0_0/36%)]"><div className="flex items-center justify-between"><h3 className="text-lg font-black text-[#214b35]">Tambah aset</h3><button className="grid h-9 w-9 place-items-center rounded-xl bg-[#ebece5] text-[#52625a]" onClick={() => { setShowCreate(false); setDetailId(null); }}><X size={18} /></button></div><p className="mt-3 text-xs text-[#6b7b6f]">Prototype: form berfungsi tetapi upload tidak dipersistensi. Produksi akan menggunakan Supabase Storage.</p><div className="mt-5 space-y-4"><label className="block text-[11px] font-extrabold text-[#405448]">Nama aset<input className="mt-2 h-11 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm outline-none focus:border-[#679158]" placeholder="Contoh: npc-arif-field" /></label><label className="block text-[11px] font-extrabold text-[#405448]">Tipe<select className="mt-2 h-11 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm outline-none focus:border-[#679158]"><option value="image">Gambar</option><option value="audio">Audio</option><option value="video">Video</option></select></label>{detailId === "url-mode" ? <label className="block text-[11px] font-extrabold text-[#405448]">URL eksternal<input className="mt-2 h-11 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm outline-none focus:border-[#679158]" placeholder="https://..." /></label> : <label className="block text-[11px] font-extrabold text-[#405448]">File<input type="file" className="mt-2 block text-sm" /></label>}</div><div className="mt-5 flex gap-3"><button className="button-secondary flex-1" onClick={() => { setShowCreate(false); setDetailId(null); }}>Batal</button><button className="button-primary flex-1" onClick={() => { setShowCreate(false); setDetailId(null); }}>Simpan draft</button></div></div></div>}
    </>
  );

  const renderAnalytics = () => (
    <>
      <span className="eyebrow">Analytics</span><h2 className="mt-2 text-2xl font-black text-[#214b35]">Statistik pembelajaran</h2><p className="mt-2 text-xs text-[#738178]">Analisis run, distribusi ending, dan kesulitan pertanyaan.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {([
          ["Run selesai", serverStats.runs, "#4b8041", Gamepad2],
          ["Jawaban dikomit", serverStats.answers, "#387594", ClipboardCheck],
          ["Kontribusi", localContributions.length, "#c76a21", MessageSquareText],
        ] as const).map(([label, value, color, Icon]) => <article key={String(label)} className="rounded-2xl border border-[#dde4db] bg-white p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${String(color)}18`, color: String(color) }}><Icon size={19} /></span><div><strong className="block text-2xl font-black text-[#243f31]">{String(value)}</strong><span className="text-[10px] font-extrabold">{String(label)}</span></div></div></article>)}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#dde4db] bg-white p-5"><h3 className="text-sm font-black text-[#214b35]">Distribusi kesulitan</h3><p className="mt-1 text-[9px] text-[#839088]">Target: Mudah · Sedang · Sulit · Tantangan (terkunci)</p><div className="mt-5 space-y-3">{[["Mudah 🌱", 40, "#76b947"], ["Sedang 🧭", 30, "#4a90e2"], ["Sulit 🔥", 20, "#ef8527"], ["Tantangan 🔒", 0, "#78867e"]].map(([label, pct, color]) => <div key={String(label)}><div className="flex justify-between text-[10px]"><span>{String(label)}</span><strong>{pct}%</strong></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-[#e6eae4]"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: String(color) }} /></div></div>)}</div></section>
        <section className="rounded-2xl border border-[#dde4db] bg-white p-5"><h3 className="text-sm font-black text-[#214b35]">Ending prototype</h3><p className="mt-1 text-[9px] text-[#839088]">Dua ending aktif; 5–7 roadmap premium</p><div className="mt-5 space-y-3">{[["Sukses Menjadi Pengawas ✅", "free", "#4d9364"], ["Perlu Pembinaan 🔄", "free", "#d94f44"], ["Pengawas Teladan ⭐", "premium", "#8a948e"], ["Penjaga Integritas 🛡️", "premium", "#8a948e"], ["Analis Cermat 🔬", "premium", "#8a948e"]].map(([label, tier, color]) => <div key={String(label)} className="flex items-center justify-between rounded-xl border border-[#e0e5dc] bg-white p-3"><span className="flex items-center gap-2 text-[11px] font-extrabold" style={{ color: String(color) }}>{String(label)}</span><span className="rounded-full px-2 py-1 text-[8px] font-black" style={{ background: tier === "free" ? "#e4f2df" : "#edf2e9", color: tier === "free" ? "#4e7c48" : "#8a948e" }}>{tier}</span></div>)}</div></section>
      </div>
    </>
  );

  const renderControl = () => (
    <>
      <span className="eyebrow">Global control</span><h2 className="mt-2 text-2xl font-black text-[#214b35]">Kontrol fitur dan konfigurasi</h2><p className="mt-2 text-xs text-[#738178]">Feature flag, maintenance, announcement, dan reset.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Object.entries(featureFlags).map(([key, enabled]) => (
          <div key={key} className="flex items-center justify-between rounded-xl border border-[#e2e7df] bg-[#f8f9f6] p-4">
            <span><strong className="block text-[11px]">{key === "leaderboard" ? "Leaderboard" : key === "contributions" ? "Kontribusi (draft)" : key === "payment" ? "Pembayaran" : key === "challenge" ? "Tantangan" : key === "hiddenScenarios" ? "Hidden scenario" : "Advanced endings"}</strong><small className="text-[8px] text-[#849088]">{enabled ? "Aktif" : "Nonaktif"}</small></span>
            <button className={`relative h-6 w-11 rounded-full p-0.5 transition ${enabled ? "bg-[#76b947]" : "bg-[#d8ddd7]"}`} onClick={() => setFeatureFlags((prev) => ({ ...prev, [key]: !enabled }))} aria-pressed={enabled} aria-label={`Toggle ${key}`}><span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} /></button>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-xl border border-[#e2e7df] bg-[#f8f9f6] p-4">
          <span><strong className="block text-[11px]">Maintenance mode</strong><small className="text-[8px] text-[#849088]">{maintMode ? "Aktif — game terkunci" : "Nonaktif"}</small></span>
          <button className={`relative h-6 w-11 rounded-full p-0.5 transition ${maintMode ? "bg-[#d94f44]" : "bg-[#d8ddd7]"}`} onClick={() => setMaintMode((prev) => !prev)} aria-pressed={maintMode}><span className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${maintMode ? "translate-x-5" : "translate-x-0"}`} /></button>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-[#dde4db] bg-white p-5"><h3 className="text-sm font-black text-[#214b35]">Announcement</h3><textarea value={announcement} onChange={(e) => setAnnouncement(e.target.value)} placeholder="Tulis pengumuman yang akan ditampilkan di game..." className="mt-3 min-h-20 w-full resize-y rounded-xl border border-[#ced8ce] bg-white p-3 text-sm outline-none focus:border-[#679158]" /><div className="mt-3 flex gap-2"><button className="button-primary !min-h-10 !rounded-xl !px-4 text-xs" onClick={() => setAnnouncement("")}>Simpan pengumuman</button>{announcement && <button className="button-secondary !min-h-10 !rounded-xl !px-4 text-xs" onClick={() => setConfirm({ title: "Hapus pengumuman?", message: "Pengumuman yang sedang aktif akan dihapus dari tampilan game.", danger: false, onConfirm: () => { setAnnouncement(""); setConfirm(null); } })}>Hapus</button>}</div></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><button className="flex items-center gap-3 rounded-2xl border border-[#dde4db] bg-white p-4 text-left" onClick={() => setConfirm({ title: "Reset global counter?", message: "Counter sesi pembelajaran akan direset ke nol. Data run tetap tersimpan. Operasi ini dicatat di audit log.", danger: true, onConfirm: () => setConfirm(null) })}><RefreshCcw size={19} className="text-[#d94f44]" /><span><strong className="block text-[11px]">Reset counter</strong><small className="text-[8px] text-[#849088]">Kosongkan statistik publik</small></span></button><button className="flex items-center gap-3 rounded-2xl border border-[#dde4db] bg-white p-4 text-left" onClick={() => setShowExport(true)}><Download size={19} className="text-[#4a90e2]" /><span><strong className="block text-[11px]">Export konten</strong><small className="text-[8px] text-[#849088]">Download package JSON/JS</small></span></button></div>
    </>
  );

  const sectionRenderers: Record<Section, () => React.ReactElement> = {
    overview: renderOverview,
    users: renderUsers,
    content: renderContent,
    contributions: renderContributions,
    assets: renderAssets,
    analytics: renderAnalytics,
    control: renderControl,
  };

  return (
    <main className="min-h-screen bg-[#f2f4ef] text-[#293d32]">
      <div className="grid min-h-screen lg:grid-cols-[244px_1fr]">
        <aside className="hidden border-r border-[#dce2d9] bg-[#193f2d] p-5 text-white lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3"><span className="brand-mark !h-10 !w-10"><Eye size={19} /></span><span><strong className="block text-sm font-black">Pengawas</strong><small className="text-[8px] font-bold tracking-widest text-white/45 uppercase">Content ops</small></span></Link>
          <nav className="mt-9 space-y-1" aria-label="Navigasi dashboard">
            {sectionConfig.map(([sec, Icon, label]) => <button key={sec} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[11px] font-extrabold transition ${section === sec ? "bg-white/12 text-white" : "text-white/55 hover:bg-white/5 hover:text-white/85"}`} onClick={() => { setSection(sec); setSearch(""); setDetailId(null); setShowCreate(false); }}><Icon size={17} />{label}{sec === "contributions" && localContributions.filter((c) => c.status === "pending").length > 0 && <span className="ml-auto rounded-full bg-[#ef8527] px-2 py-0.5 text-[8px] text-white">{localContributions.filter((c) => c.status === "pending").length}</span>}</button>)}
          </nav>
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.06] p-4"><LockKeyhole size={18} className="text-[#f2a451]" /><strong className="mt-3 block text-xs">Prototype access</strong><p className="mt-2 text-[9px] leading-5 text-white/45">OAuth, role validation, dan middleware wajib diaktifkan sebelum produksi.</p></div>
          <Link href="/" className="mt-4 flex items-center gap-2 px-3 text-[10px] font-bold text-white/55"><Home size={14} /> Kembali ke situs</Link>
        </aside>

        <section className="min-w-0">
          <header className="flex min-h-[72px] items-center justify-between border-b border-[#dce2d9] bg-white px-5 sm:px-8">
            <div className="flex items-center gap-3"><span className="brand-mark !h-9 !w-9 lg:hidden"><Eye size={17} /></span><div><h1 className="text-sm font-black text-[#214b35] sm:text-base">Content Operations</h1><p className="hidden text-[9px] font-semibold text-[#7a887f] sm:block">Baseline prototype · 23 Juli 2026</p></div></div>
            <div className="flex items-center gap-2 lg:hidden">{sectionConfig.filter((s) => s[0] !== "overview").slice(0, 4).map(([sec, Icon, label]) => <button key={sec} className={`grid h-10 w-10 place-items-center rounded-xl border text-[9px] font-black ${section === sec ? "border-[#76b947] bg-[#e6f1df] text-[#4b8041]" : "border-[#dce2d9] bg-white text-[#607067]"}`} onClick={() => { setSection(sec); setSearch(""); }} aria-label={label}><Icon size={17} /></button>)}</div>
          </header>

          <div className="mx-auto max-w-[1320px] p-5 sm:p-8 game-scrollbar max-h-[calc(100dvh-72px)] overflow-auto">
            {sectionRenderers[section]()}
          </div>
        </section>
      </div>

      {showExport && <div className="fixed inset-0 z-[70] grid place-items-center p-4 bg-[rgb(15_39_28/58%)] backdrop-blur-[5px]" role="dialog" aria-modal="true"><div className="w-full max-w-md rounded-3xl border-2 border-[#5d4037] bg-[#f9f7f2] p-6 shadow-[0_24px_80px_rgb(0_0_0/36%)]"><div className="flex items-center justify-between"><h3 className="text-lg font-black text-[#214b35]">Export konten</h3><button className="grid h-9 w-9 place-items-center rounded-xl bg-[#ebece5] text-[#52625a]" onClick={() => { setShowExport(false); setExportStatus("idle"); setExportToken(""); }}><X size={18} /></button></div><p className="mt-3 text-xs text-[#6b7b6f]">Masukkan token export admin. Token dikonfigurasi via environment variable ADMIN_EXPORT_TOKEN.</p><input value={exportToken} onChange={(e) => setExportToken(e.target.value)} type="password" placeholder="Token export..." className="mt-4 h-11 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm outline-none focus:border-[#679158]" />{exportStatus === "error" && <p className="mt-3 text-xs font-bold text-[#d94f44]">Export gagal. Periksa token dan coba lagi.</p>}{exportStatus === "done" && <p className="mt-3 text-xs font-bold text-[#4d9364]">Export berhasil! File telah diunduh.</p>}<div className="mt-5 flex gap-3"><button className="button-secondary flex-1" onClick={() => { setShowExport(false); setExportStatus("idle"); setExportToken(""); }}>Batal</button><button className="button-primary flex-1" disabled={!exportToken || exportStatus === "loading"} onClick={doExport}>{exportStatus === "loading" ? "Mengexport..." : "Download JSON"}</button></div></div></div>}

      {confirm && <ConfirmDialog title={confirm.title} message={confirm.message} danger={confirm.danger} confirmLabel="Ya, lanjutkan" cancelLabel="Batal" onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
    </main>
  );
}
