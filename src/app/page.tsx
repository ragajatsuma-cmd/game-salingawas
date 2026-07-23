import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  ExternalLink,
  Eye,
  Gamepad2,
  Globe2,
  HeartHandshake,
  Leaf,
  LockKeyhole,
  MapPinned,
  MessageCircle,
  Scale,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { and, asc, count, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { gameRuns, globalStats } from "@/db/schema";

export const dynamic = "force-dynamic";

type PublicRun = {
  playerAlias: string;
  region: string;
  difficulty: string;
  completionSeconds: number | null;
};

async function getLandingData() {
  try {
    const statsRow = await db.select().from(globalStats).where(eq(globalStats.id, "global")).limit(1);
    const [{ totalRuns }] = await db
      .select({ totalRuns: count() })
      .from(gameRuns)
      .where(isNotNull(gameRuns.completedAt));
    const leaders: PublicRun[] = await db
      .select({
        playerAlias: gameRuns.playerAlias,
        region: gameRuns.region,
        difficulty: gameRuns.difficulty,
        completionSeconds: gameRuns.completionSeconds,
      })
      .from(gameRuns)
      .where(and(eq(gameRuns.validForLeaderboard, true), isNotNull(gameRuns.completedAt)))
      .orderBy(asc(gameRuns.completionSeconds))
      .limit(3);

    return {
      registered: statsRow[0]?.totalRegisteredUsers ?? 0,
      runs: Number(totalRuns ?? 0),
      contributions: statsRow[0]?.totalPublishedContributions ?? 0,
      leaders,
    };
  } catch {
    return { registered: 0, runs: 0, contributions: 0, leaders: [] as PublicRun[] };
  }
}

function formatTime(seconds: number | null) {
  if (!seconds) return "—";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${String(seconds % 60).padStart(2, "0")}d`;
}

export default async function HomePage() {
  const data = await getLandingData();

  return (
    <main className="paper-texture min-h-screen overflow-hidden">
      <header className="sticky top-0 z-50 border-b border-[#dce7d8]/80 bg-[#fffaf0]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Pengawas Partisipatif, beranda">
            <span className="brand-mark" aria-hidden="true"><Eye size={22} strokeWidth={2.8} /></span>
            <span className="leading-tight">
              <strong className="block text-[15px] font-black tracking-[-.02em] text-[#214b35] sm:text-[17px]">Pengawas Partisipatif</strong>
              <span className="hidden text-[10px] font-bold tracking-[.12em] text-[#6c7e73] uppercase sm:block">Belajar · Amati · Bertindak</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-[13px] font-bold text-[#53675b] md:flex" aria-label="Navigasi utama">
            <a href="#fitur" className="hover:text-[#214b35]">Fitur</a>
            <a href="#cara-belajar" className="hover:text-[#214b35]">Cara belajar</a>
            <a href="#transparansi" className="hover:text-[#214b35]">Transparansi</a>
            <a href="#tentang" className="hover:text-[#214b35]">Tentang</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/play" className="button-ghost hidden !min-h-10 !px-3 text-sm sm:inline-flex">Masuk</Link>
            <Link href="/play" className="button-primary !min-h-10 !px-4 !py-2 text-sm">
              Main sekarang <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-[1180px] items-center gap-12 px-5 pt-14 pb-20 lg:grid-cols-[.94fr_1.06fr] lg:px-8 lg:pt-20">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#bdd5b4] bg-white/80 px-3 py-2 text-[11px] font-extrabold tracking-[.08em] text-[#417044] uppercase shadow-sm">
            <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-[#76b947] opacity-50" /><span className="relative h-2 w-2 rounded-full bg-[#4f963e]" /></span>
            Prototype pembelajaran · v0.1
          </div>
          <h1 className="max-w-[680px] text-[clamp(2.75rem,7.2vw,5.45rem)] font-black leading-[.92] tracking-[-.055em] text-[#183f2d]">
            Belajar mengawasi lewat <span className="relative inline-block text-[#e9781e]">cerita.<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 13" aria-hidden="true"><path d="M3 9c54-8 112-7 214-4" fill="none" stroke="#f4b05c" strokeLinecap="round" strokeWidth="6" opacity=".6" /></svg></span>
          </h1>
          <p className="mt-7 max-w-[590px] text-[17px] leading-8 text-[#52665b]">
            Jelajahi desa pembelajaran, temui warga, periksa bukti, dan ambil keputusan yang menjaga hak serta integritas proses.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/play" className="button-primary px-7">
              <Gamepad2 size={19} aria-hidden="true" /> Mulai simulasi
            </Link>
            <a href="#cara-belajar" className="button-secondary px-6">
              Lihat cara bermain <ChevronRight size={17} aria-hidden="true" />
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[12px] font-bold text-[#61766a]">
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#5a9a4d]" /> Gratis untuk prototype</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#5a9a4d]" /> Tanpa karakter berjalan</span>
            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#5a9a4d]" /> Progres lokal aman</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[650px] lg:mx-0">
          <div className="absolute -top-8 -right-10 h-40 w-40 rounded-full bg-[#f2bf5d]/25 blur-3xl" />
          <div className="absolute -bottom-8 -left-10 h-44 w-44 rounded-full bg-[#76b947]/25 blur-3xl" />
          <div className="relative aspect-[1.16] overflow-hidden rounded-[34px] border-[6px] border-white bg-[#b9dbb2] shadow-[0_28px_70px_rgba(30,68,46,.24)]">
            <Image src="/images/desa-pengawasan-map.jpg" alt="Peta desa pembelajaran dengan bangunan interaktif" fill priority sizes="(max-width: 1024px) 94vw, 52vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#123725]/40 via-transparent to-white/10" />
            <div className="absolute top-5 left-5 flex items-center gap-2 rounded-full border border-white/50 bg-[#163d2c]/85 px-3 py-2 text-[11px] font-extrabold text-white backdrop-blur-md">
              <Compass size={15} className="text-[#f8be64]" /> DESA PEMBELAJARAN
            </div>
            <div className="leaf-float absolute top-[37%] right-[14%] rounded-2xl border-2 border-white bg-white/95 p-3 shadow-xl">
              <span className="block text-[10px] font-black tracking-wider text-[#6b7b70] uppercase">Tujuan aktif</span>
              <strong className="mt-1 flex items-center gap-2 text-sm text-[#214b35]"><MapPinned size={17} className="text-[#ef7d22]" /> Balai Kota</strong>
            </div>
            <div className="absolute right-5 bottom-5 left-5 flex items-center justify-between rounded-2xl border border-white/35 bg-[#173b2c]/88 px-4 py-3 text-white backdrop-blur-md">
              <div><span className="block text-[9px] font-bold tracking-widest text-white/65 uppercase">Misi berikutnya</span><strong className="text-sm">Temui Arif</strong></div>
              <div className="flex -space-x-2" aria-hidden="true">{["A", "M", "D"].map((letter, index) => <span key={letter} className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#173b2c] text-[10px] font-black text-white" style={{ background: ["#e47a33", "#43876a", "#5e77a8"][index] }}>{letter}</span>)}</div>
            </div>
          </div>
          <div className="absolute -right-2 -bottom-5 hidden items-center gap-3 rounded-2xl border border-[#d7e3d2] bg-[#fffdf8] px-4 py-3 shadow-xl sm:flex">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eaf5df] text-[#4a853e]"><SearchCheck size={21} /></span>
            <span><strong className="block text-sm text-[#214b35]">Bukan hafalan</strong><small className="text-[#6c7c73]">Latihan menimbang fakta</small></span>
          </div>
        </div>
      </section>

      <section className="border-y border-[#dce6d7] bg-white/65">
        <div className="mx-auto grid max-w-[1180px] grid-cols-2 divide-x divide-[#dce6d7] px-5 sm:grid-cols-4 lg:px-8">
          {[
            [data.runs.toLocaleString("id-ID"), "Sesi dimainkan", Gamepad2],
            ["26", "Misi kanonik", MapPinned],
            ["78", "Variasi pertanyaan", BookOpenCheck],
            [data.contributions.toLocaleString("id-ID"), "Kontribusi terbit", HeartHandshake],
          ].map(([value, label, Icon], index) => (
            <div key={String(label)} className={`flex items-center justify-center gap-3 px-3 py-6 ${index > 1 ? "border-t border-[#dce6d7] sm:border-t-0" : ""}`}>
              <Icon className="hidden text-[#6aa24f] sm:block" size={22} />
              <span><strong className="block text-xl font-black text-[#214b35]">{String(value)}</strong><small className="text-[11px] font-semibold text-[#718078]">{String(label)}</small></span>
            </div>
          ))}
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-[1180px] px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Ruang belajar yang aman</span>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] font-black tracking-[-.04em] text-[#214b35]">Setiap pilihan punya konsekuensi</h2>
          <p className="mt-4 leading-7 text-[#61736a]">Bukan sekadar benar atau salah. Pelajari mengapa sebuah respons lebih lengkap, proporsional, dan dapat dipertanggungjawabkan.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            [MapPinned, "Jelajahi peta", "Sepuluh bangunan menjadi pintu masuk ke situasi lapangan yang berbeda.", "#e9f4dd", "#4c863f"],
            [Scale, "Timbang keputusan", "Lima respons bernuansa menguji fakta, proses, hak, dan kualitas bukti.", "#fff0d8", "#d76d1e"],
            [BookOpenCheck, "Bangun pengetahuan", "Refleksi, badge, dan Codex membantu prinsip penting tetap mudah diingat.", "#e3f0f7", "#337a9d"],
          ].map(([Icon, title, copy, bg, color]) => (
            <article key={String(title)} className="soft-card group p-7 transition-transform hover:-translate-y-1">
              <span className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: String(bg), color: String(color) }}><Icon size={27} /></span>
              <h3 className="mt-6 text-xl font-black text-[#244936]">{String(title)}</h3>
              <p className="mt-3 text-sm leading-7 text-[#65756d]">{String(copy)}</p>
              <Link href="/play" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#3c7041]">Coba sekarang <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section id="cara-belajar" className="relative overflow-hidden bg-[#214b35] py-24 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 10%, white 0 1px, transparent 2px)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto grid max-w-[1180px] gap-14 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <span className="eyebrow !text-[#a9d993]">Cara belajar</span>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.4rem)] font-black leading-[1.02] tracking-[-.04em]">Kamu tetap memegang kendali.</h2>
            <p className="mt-5 max-w-md leading-7 text-white/70">Tidak ada karakter yang berjalan sendiri dan tidak ada perpindahan otomatis. Klik bangunan, pilih NPC, amati kasus, lalu putuskan dengan sadar.</p>
            <Link href="/play" className="button-primary mt-8">Masuk ke desa <ArrowRight size={17} /></Link>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {[
              ["01", "Pilih bangunan", "Gunakan tujuan aktif sebagai petunjuk, bukan jalur yang memaksa."],
              ["02", "Dengarkan NPC", "Amati konteks dan fokus bukti sebelum membuka studi kasus."],
              ["03", "Ambil keputusan", "Pilih satu dari lima respons tanpa petunjuk posisi jawaban."],
              ["04", "Refleksikan", "Baca kualitas keputusan dan area yang masih perlu diperkuat."],
            ].map(([number, title, copy]) => (
              <li key={number} className="rounded-3xl border border-white/12 bg-white/[.07] p-6 backdrop-blur-sm">
                <span className="text-xs font-black tracking-widest text-[#f6a44d]">LANGKAH {number}</span>
                <h3 className="mt-3 text-lg font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="transparansi" className="mx-auto grid max-w-[1180px] gap-6 px-5 py-24 lg:grid-cols-[1.08fr_.92fr] lg:px-8">
        <div className="soft-card overflow-hidden p-7 sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><span className="eyebrow">Leaderboard tervalidasi</span><h2 className="mt-3 text-2xl font-black text-[#214b35]">Pelajar tercepat</h2></div>
            <span className="rounded-full bg-[#eaf5e2] px-3 py-2 text-[10px] font-black tracking-wider text-[#4e7c48] uppercase">Data server</span>
          </div>
          <div className="mt-7 overflow-hidden rounded-2xl border border-[#e1e8de]">
            {data.leaders.length > 0 ? data.leaders.map((run, index) => (
              <div key={`${run.playerAlias}-${index}`} className="grid grid-cols-[42px_1fr_auto] items-center gap-3 border-b border-[#e8ede6] px-4 py-4 last:border-0">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f1f4ec] text-xs font-black">{index + 1}</span>
                <span><strong className="block text-sm">{run.playerAlias}</strong><small className="text-[#7a8880]">{run.region} · {run.difficulty}</small></span>
                <strong className="text-sm text-[#d86a1c]">{formatTime(run.completionSeconds)}</strong>
              </div>
            )) : (
              <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-[#eef5e9] text-[#62904f]"><Trophy size={26} /></span>
                <strong className="mt-4 text-[#2d513d]">Belum ada run tervalidasi</strong>
                <p className="mt-1 max-w-sm text-sm leading-6 text-[#718079]">Papan ini tidak memakai data demo. Selesaikan prototype untuk mulai membangun catatan pembelajaran.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="relative overflow-hidden rounded-[28px] bg-[#f6a34b] p-8 text-[#402a18] shadow-[0_18px_50px_rgba(188,93,24,.15)] sm:p-9">
          <Sparkles className="absolute -right-5 -top-5 h-28 w-28 text-white/20" />
          <span className="inline-flex rounded-full bg-white/30 px-3 py-1.5 text-[10px] font-black tracking-widest uppercase">Catatan penting</span>
          <h2 className="mt-5 text-2xl font-black leading-tight">Simulasi, bukan keputusan hukum.</h2>
          <p className="mt-4 text-sm leading-7 text-[#5b3b22]">Materi prototype masih memerlukan validasi ahli dan verifikasi sumber hukum primer. Produk ini bukan alat resmi penanganan pelanggaran, sertifikasi profesi, atau representasi lembaga negara.</p>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/35 p-4"><strong className="block text-2xl font-black">{data.registered}</strong><small className="font-bold">pengguna terdaftar</small></div>
            <div className="rounded-2xl bg-white/35 p-4"><strong className="block text-2xl font-black">3</strong><small className="font-bold">tingkat aktif</small></div>
          </div>
        </aside>
      </section>

      <section className="px-5 pb-24 lg:px-8">
        <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[34px] bg-[#e8f2de] px-7 py-14 text-center sm:px-12">
          <Leaf className="leaf-float absolute left-[8%] top-8 text-[#8fbd73]" size={36} />
          <Globe2 className="absolute right-[8%] bottom-8 text-[#abc992]" size={44} />
          <span className="eyebrow">Satu keputusan pada satu waktu</span>
          <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(2rem,4.5vw,3.6rem)] font-black leading-[1.02] tracking-[-.045em] text-[#214b35]">Siap membaca fakta dengan lebih jernih?</h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-[#627166]">Mulai dari Balai Kota dan selesaikan tujuan pertamamu. Progres tersimpan di perangkat ini.</p>
          <Link href="/play" className="button-primary mt-8 px-7"><Gamepad2 size={19} /> Main sekarang</Link>
        </div>
      </section>

      <footer id="tentang" className="border-t border-[#d7e2d3] bg-[#183f2d] text-white">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 md:grid-cols-[1.3fr_.7fr_.7fr] lg:px-8">
          <div><div className="flex items-center gap-3"><span className="brand-mark"><Eye size={21} /></span><strong>Pengawas Partisipatif</strong></div><p className="mt-5 max-w-md text-sm leading-7 text-white/60">Simulasi pembelajaran pengawasan Pemilu dan Pilkada. Learning first—gameplay supports learning.</p></div>
          <div><strong className="text-sm">Produk</strong><ul className="mt-4 space-y-3 text-sm text-white/60"><li><Link href="/play">Mulai bermain</Link></li><li><Link href="/kontribusi">Kirim kontribusi</Link></li><li><Link href="/dashboard-rahasia-game">Dashboard prototype</Link></li><li><a href="#transparansi">Disclaimer</a></li></ul></div>
          <div><strong className="text-sm">Pengembang</strong><p className="mt-4 text-sm text-white/60">Raga Jatsuma</p><a href="https://wa.me/6285156838450" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#b9db9f]"><MessageCircle size={16} /> WhatsApp <ExternalLink size={12} /></a></div>
        </div>
        <div className="border-t border-white/10 px-5 py-5 text-center text-[11px] text-white/45">© 2026 Raga Jatsuma · game.ragajatsuma.my.id · Baseline prototype, belum production-ready.</div>
      </footer>
    </main>
  );
}
