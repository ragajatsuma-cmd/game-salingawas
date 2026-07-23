"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, FileText, HeartHandshake, Send, ShieldCheck, Sparkles } from "lucide-react";

const clean = (value: string, max: number) => value.replace(/[<>]/g, "").slice(0, max);

export default function ContributionPage() {
  const [form, setForm] = useState({ alias: "", type: "scenario", title: "", scenario: "", reasoning: "", sources: "" });
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contributions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const body = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(body.error ?? "Kontribusi belum dapat disimpan.");
      setState("success");
      setMessage(body.message ?? "Draft tersimpan.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    }
  };

  return (
    <main className="paper-texture min-h-screen">
      <header className="border-b border-[#dce5d8] bg-[#fffaf0]/90 backdrop-blur-lg">
        <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3"><span className="brand-mark !h-10 !w-10"><Eye size={19} /></span><span><strong className="block text-sm font-black text-[#214b35]">Pengawas Partisipatif</strong><small className="text-[9px] font-bold tracking-wider text-[#77867d] uppercase">Ruang kontribusi</small></span></Link>
          <Link href="/" className="button-secondary !min-h-10 !px-4 text-xs"><ArrowLeft size={15} /> Beranda</Link>
        </div>
      </header>
      <section className="mx-auto grid max-w-[1120px] gap-8 px-5 py-10 lg:grid-cols-[.72fr_1.28fr] lg:py-16">
        <aside>
          <span className="eyebrow">Dari warga, untuk belajar</span>
          <h1 className="mt-4 text-[clamp(2.5rem,6vw,4.7rem)] font-black leading-[.94] tracking-[-.055em] text-[#214b35]">Bagikan situasi yang layak dipelajari.</h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#65756c]">Kontribusi tidak langsung masuk ke game. Moderator akan memeriksa kejelasan, privasi, sumber, dan implikasi normatifnya.</p>
          <div className="mt-7 grid gap-3">
            {[[ShieldCheck, "Privasi lebih dulu", "Jangan sertakan identitas sensitif atau data perkara nyata."], [FileText, "Sertakan konteks", "Pisahkan fakta, dugaan, dan penalaran yang diusulkan."], [Sparkles, "Divalidasi manusia", "Konten hukum memerlukan ahli dan sumber primer sebelum terbit."]].map(([Icon, title, copy]) => <div key={String(title)} className="flex gap-3 rounded-2xl border border-[#dfe7dc] bg-white/70 p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e7f1df] text-[#568044]"><Icon size={19} /></span><span><strong className="block text-xs text-[#34513f]">{String(title)}</strong><small className="mt-1 block text-[10px] leading-5 text-[#77837b]">{String(copy)}</small></span></div>)}
          </div>
        </aside>

        <section className="soft-card p-5 sm:p-8">
          {state === "success" ? <div className="grid min-h-[560px] place-items-center text-center"><div><span className="mx-auto grid h-20 w-20 place-items-center rounded-[26px] bg-[#e4f2df] text-[#4d9364]"><CheckCircle2 size={38} /></span><h2 className="mt-6 text-2xl font-black text-[#214b35]">Draft berhasil disimpan</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#65756c]">{message} Kontribusi belum dipublikasikan dan tidak akan muncul di game tanpa proses review.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><button className="button-primary" onClick={() => { setForm({ alias: form.alias, type: "scenario", title: "", scenario: "", reasoning: "", sources: "" }); setState("idle"); }}>Kirim ide lain</button><Link href="/" className="button-secondary">Kembali ke beranda</Link></div></div></div> : <form onSubmit={submit}>
            <div className="flex items-center gap-3 border-b border-[#e2e7df] pb-5"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0dc] text-[#d46c1d]"><HeartHandshake size={23} /></span><div><h2 className="text-lg font-black text-[#294936]">Form kontribusi draft</h2><p className="text-[9px] text-[#7b887f]">Seluruh field diperlakukan sebagai materi belum tervalidasi.</p></div></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-[11px] font-extrabold text-[#405448]">Alias kontributor<input required maxLength={32} value={form.alias} onChange={(e) => setForm({ ...form, alias: clean(e.target.value, 32) })} className="mt-2 h-12 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm font-semibold outline-none focus:border-[#679158]" placeholder="Nama publik" /></label>
              <label className="text-[11px] font-extrabold text-[#405448]">Jenis kontribusi<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-2 h-12 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm font-semibold outline-none focus:border-[#679158]"><option value="scenario">Skenario</option><option value="question">Pertanyaan</option><option value="dialogue">Dialog NPC</option><option value="correction">Koreksi materi</option></select></label>
            </div>
            <label className="mt-4 block text-[11px] font-extrabold text-[#405448]">Judul ide<input required minLength={5} maxLength={100} value={form.title} onChange={(e) => setForm({ ...form, title: clean(e.target.value, 100) })} className="mt-2 h-12 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm font-semibold outline-none focus:border-[#679158]" placeholder="Judul singkat dan netral" /></label>
            <label className="mt-4 block text-[11px] font-extrabold text-[#405448]">Situasi atau materi<textarea required minLength={30} maxLength={3000} value={form.scenario} onChange={(e) => setForm({ ...form, scenario: clean(e.target.value, 3000) })} className="mt-2 min-h-32 w-full resize-y rounded-xl border border-[#ced8ce] bg-white p-4 text-sm leading-6 outline-none focus:border-[#679158]" placeholder="Jelaskan konteks, fakta yang tersedia, dan bagian yang belum pasti..." /><span className="mt-1 block text-right text-[8px] font-medium text-[#8a948e]">{form.scenario.length}/3000</span></label>
            <label className="mt-3 block text-[11px] font-extrabold text-[#405448]">Penalaran yang diusulkan <span className="font-medium text-[#89938d]">(opsional)</span><textarea maxLength={1600} value={form.reasoning} onChange={(e) => setForm({ ...form, reasoning: clean(e.target.value, 1600) })} className="mt-2 min-h-24 w-full resize-y rounded-xl border border-[#ced8ce] bg-white p-4 text-sm leading-6 outline-none focus:border-[#679158]" placeholder="Apa prinsip pembelajaran atau risiko keputusan yang penting?" /></label>
            <label className="mt-4 block text-[11px] font-extrabold text-[#405448]">Sumber pendukung <span className="font-medium text-[#89938d]">(opsional)</span><input maxLength={1200} value={form.sources} onChange={(e) => setForm({ ...form, sources: clean(e.target.value, 1200) })} className="mt-2 h-12 w-full rounded-xl border border-[#ced8ce] bg-white px-4 text-sm outline-none focus:border-[#679158]" placeholder="URL atau rujukan sumber primer" /></label>
            {message && <p role="alert" className={`mt-4 rounded-xl p-3 text-xs font-bold ${state === "error" ? "bg-[#fde9e6] text-[#b6473e]" : "bg-[#e8f1e2] text-[#4d7445]"}`}>{message}</p>}
            <button disabled={state === "sending"} className="button-primary mt-6 w-full disabled:cursor-wait disabled:opacity-60">{state === "sending" ? "Menyimpan draft..." : <><Send size={17} /> Simpan kontribusi draft</>}</button>
          </form>}
        </section>
      </section>
    </main>
  );
}
