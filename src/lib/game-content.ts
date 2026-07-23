export type Difficulty = "easy" | "medium" | "hard";
export type OptionQuality = "best" | "strong" | "partial" | "risky" | "fatal";

export type Building = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  position: { x: number; y: number };
  icon: string;
};

export type Npc = {
  id: string;
  name: string;
  role: string;
  buildingId: string;
  missionId: string;
  color: string;
};

export type Mission = {
  id: string;
  title: string;
  sequence: number;
  buildingId: string;
  npcId: string;
  context: string;
  principle: string;
  objectiveHint: string;
  bestAction: string;
  legalValidationStatus: "needs-review";
};

export type QuestionOption = {
  id: string;
  text: string;
  quality: OptionQuality;
  integrityDelta: number;
  knowledgeDelta: number;
  reasoningDelta: number;
  livesDelta: number;
  feedback: string;
};

export type Question = {
  id: string;
  missionId: string;
  category: string;
  text: string;
  timerSeconds: Record<Difficulty, number>;
  options: QuestionOption[];
};

export const buildings: Building[] = [
  { id: "town-hall", name: "Balai Kota", shortName: "Balai Kota", description: "Pusat orientasi kelembagaan, koordinasi, dan etika pengawasan.", position: { x: 48, y: 26 }, icon: "🏛️" },
  { id: "voter-data", name: "Data Pemilih", shortName: "Data Pemilih", description: "Ruang pemeriksaan daftar, identitas, dan jejak pembaruan data.", position: { x: 22, y: 34 }, icon: "🗂️" },
  { id: "nomination", name: "Pencalonan", shortName: "Pencalonan", description: "Paviliun verifikasi syarat, dokumen, dan perlindungan hak pencalonan.", position: { x: 72, y: 31 }, icon: "📋" },
  { id: "campaign", name: "Kampanye", shortName: "Kampanye", description: "Ruang publik untuk menelaah informasi, metode, dan konflik kepentingan.", position: { x: 84, y: 51 }, icon: "📣" },
  { id: "logistics", name: "Logistik", shortName: "Logistik", description: "Gudang audit distribusi, segel, dokumen, dan rantai penguasaan.", position: { x: 67, y: 66 }, icon: "📦" },
  { id: "polling", name: "TPS", shortName: "TPS", description: "Tempat mengamati pelayanan pemilih dan proses pemungutan suara.", position: { x: 39, y: 70 }, icon: "🗳️" },
  { id: "recap", name: "Rekap", shortName: "Rekap", description: "Ruang pencocokan catatan, keberatan, angka, dan audit trail.", position: { x: 18, y: 65 }, icon: "🧮" },
  { id: "watch-village", name: "Kampung Pengawasan", shortName: "Kampung", description: "Pos partisipasi warga, pelindungan sumber, dan informasi awal.", position: { x: 12, y: 48 }, icon: "🤝" },
  { id: "planning", name: "Perencanaan", shortName: "Perencanaan", description: "Studio pemetaan risiko dan rancangan tindak lanjut yang terukur.", position: { x: 57, y: 45 }, icon: "🗺️" },
  { id: "determination", name: "Gedung Penetapan", shortName: "Penetapan", description: "Tahap refleksi akhir, debrief, dan penetapan hasil simulasi.", position: { x: 88, y: 25 }, icon: "🏅" },
];

const npcSeeds = [
  ["arif", "Arif", "Koordinator orientasi", "town-hall", "Orientasi Mandat", "Papan pembagian kewenangan memuat istilah yang mirip dan perlu dibaca hati-hati.", "Pastikan mandat, batas kewenangan, dan jalur koordinasi dipahami sebelum bertindak.", "Temui Arif untuk memahami batas mandat.", "Petakan kewenangan, catat batas tindakan, lalu gunakan jalur koordinasi yang dapat diaudit."],
  ["maya", "Maya", "Analis data pemilih", "voter-data", "Nama yang Muncul Dua Kali", "Dua identitas memiliki nama sama, tetapi dokumen dan waktu pembaruannya berbeda.", "Kesamaan nama adalah petunjuk, bukan bukti duplikasi.", "Bantu Maya membandingkan dua catatan pemilih.", "Catat perbedaan, bandingkan dokumen dan jejak pembaruan, lalu klarifikasi sebelum menyimpulkan."],
  ["dimas", "Dimas", "Verifikator pencalonan", "nomination", "Dokumen yang Tidak Selaras", "Satu informasi pada dokumen pencalonan tidak selaras dengan dokumen pendukung.", "Verifikasi harus berbasis fakta, konsisten, dan tetap melindungi hak.", "Periksa berkas bersama Dimas.", "Dokumentasikan ketidaksesuaian, periksa sumber primer, dan tempuh klarifikasi sesuai prosedur."],
  ["nadia", "Nadia", "Penjaga etika", "town-hall", "Undangan yang Berisiko", "Seorang pihak berkepentingan mengundang tim ke pertemuan informal tertutup.", "Independensi juga dijaga melalui pengelolaan persepsi dan konflik kepentingan.", "Diskusikan undangan informal dengan Nadia.", "Tolak atau kelola undangan secara transparan, catat komunikasi, dan gunakan forum resmi."],
  ["raka", "Raka", "Pemantau kampanye", "campaign", "Materi di Ruang Publik", "Materi kampanye terlihat di area yang perlu diperiksa status dan konteks penggunaannya.", "Konteks tempat, waktu, subjek, dan bukti harus lengkap sebelum klasifikasi.", "Temui Raka di area kampanye.", "Amankan dokumentasi yang sah, verifikasi lokasi, waktu, subjek, dan aturan relevan sebelum klasifikasi."],
  ["sinta", "Sinta", "Auditor logistik", "logistics", "Segel yang Berbeda", "Satu kemasan logistik memiliki kondisi segel berbeda dari catatan penerimaan.", "Rantai penguasaan dan dokumentasi lebih penting daripada dugaan cepat.", "Periksa segel bersama Sinta.", "Jaga kondisi barang, cocokkan catatan serah terima, dokumentasikan, dan eskalasi melalui jalur resmi."],
  ["bima", "Bima", "Pengawas TPS", "polling", "Akses Pemilih", "Seorang pemilih membutuhkan bantuan, sementara situasi TPS mulai ramai.", "Aksesibilitas dan kerahasiaan suara harus dilindungi bersamaan.", "Bantu Bima menjaga akses di TPS.", "Pastikan kebutuhan bantuan, jelaskan pilihan yang sah, dan lindungi kerahasiaan serta kemandirian pemilih."],
  ["laras", "Laras", "Analis rekap", "recap", "Angka yang Tidak Cocok", "Salinan catatan lapangan berbeda dengan angka pada tampilan rekap.", "Perbedaan angka harus ditelusuri melalui dokumen dan mekanisme koreksi yang tercatat.", "Telusuri selisih angka bersama Laras.", "Tandai selisih, cocokkan dokumen sumber, ajukan koreksi melalui forum resmi, dan simpan jejaknya."],
  ["fajar", "Fajar", "Penulis LHP", "recap", "Catatan Tanpa Konteks", "Sebuah catatan kejadian penting belum memuat waktu, pihak, dan sumber informasi lengkap.", "LHP yang baik memisahkan fakta, sumber, analisis, dan kesimpulan.", "Lengkapi catatan Fajar.", "Lengkapi unsur waktu, tempat, pihak, sumber, bukti, dan pisahkan fakta dari interpretasi."],
  ["ayu", "Ayu", "Petugas layanan pemilih", "polling", "Antrean dan Prioritas", "Antrean memanjang saat beberapa pemilih membutuhkan layanan aksesibel.", "Pelayanan proporsional menjaga akses tanpa mengurangi hak pemilih lain.", "Atur layanan aksesibel bersama Ayu.", "Identifikasi kebutuhan, terapkan pengaturan aksesibel yang transparan, dan komunikasikan kepada antrean."],
  ["hendra", "Hendra", "Koordinator distribusi", "logistics", "Pengiriman Terlambat", "Jadwal distribusi bergeser dan informasi dari dua petugas belum konsisten.", "Respons risiko dimulai dari verifikasi status dan pencatatan rantai distribusi.", "Periksa keterlambatan dengan Hendra.", "Verifikasi posisi, waktu, penanggung jawab, dan kondisi logistik lalu catat mitigasi serta eskalasi."],
  ["nisa", "Nisa", "Petugas klarifikasi data", "voter-data", "Alamat yang Berubah", "Pemilih menunjukkan dokumen baru sementara basis data masih memuat alamat lama.", "Perubahan data perlu ditangani dengan bukti dan prosedur, bukan asumsi.", "Bantu Nisa menelaah perubahan alamat.", "Periksa dokumen pendukung dan riwayat perubahan, lalu arahkan koreksi melalui prosedur yang berlaku."],
  ["reno", "Reno", "Pemeriksa kelengkapan", "nomination", "Berkas Menjelang Batas Waktu", "Berkas tambahan tiba mendekati batas waktu dan perlu pemeriksaan yang setara.", "Tekanan waktu tidak boleh menghapus quality gate atau perlakuan setara.", "Periksa kelengkapan bersama Reno.", "Catat waktu penerimaan, lakukan quality gate yang sama, dan dokumentasikan hasil tanpa perlakuan istimewa."],
  ["wulan", "Wulan", "Analis informasi publik", "campaign", "Potongan Video Viral", "Potongan video tanpa konteks menyebar cepat dan memicu tuntutan tindakan segera.", "Viralitas bukan pengganti verifikasi sumber, konteks, dan keutuhan bukti.", "Verifikasi video bersama Wulan.", "Simpan sumber, cari versi utuh, verifikasi waktu dan lokasi, lalu pisahkan fakta dari klaim."],
  ["dedi", "Dedi", "Pemeriksa daftar", "voter-data", "Pemilih Tidak Ditemukan", "Seorang warga tidak menemukan namanya dan membawa beberapa bukti pendukung.", "Hak pilih perlu dilindungi melalui pemeriksaan teliti dan informasi prosedur yang jelas.", "Telusuri data warga bersama Dedi.", "Periksa identitas dan sumber data yang relevan, catat temuan, serta jelaskan jalur tindak lanjut."],
  ["salma", "Salma", "Penjaga audit trail", "logistics", "Formulir Tanpa Paraf", "Satu tahap serah terima tidak memiliki paraf meski barang tampak lengkap.", "Kelengkapan fisik tidak menggantikan audit trail administratif.", "Periksa formulir bersama Salma.", "Dokumentasikan kekosongan, klarifikasi petugas terkait, dan lakukan perbaikan tercatat tanpa merekayasa dokumen."],
  ["joko", "Joko", "Pemantau proses TPS", "polling", "Foto di Area Terbatas", "Seseorang mengambil foto di area yang dapat berisiko pada kerahasiaan pilihan.", "Penanganan harus cepat, proporsional, dan melindungi hak serta bukti.", "Tinjau situasi bersama Joko.", "Hentikan risiko secara proporsional, lindungi kerahasiaan, catat fakta, dan ikuti prosedur setempat."],
  ["tari", "Tari", "Fasilitator warga", "watch-village", "Informasi Awal Warga", "Warga menyampaikan informasi penting tetapi belum siap membuat laporan formal.", "Informasi awal tetap dapat dicatat dan diverifikasi tanpa menekan sumber.", "Dengarkan informasi awal bersama Tari.", "Catat unsur dasar dengan persetujuan, jelaskan perbedaan informasi dan laporan, serta lindungi sumber."],
  ["yusuf", "Yusuf", "Pemeriksa keberatan", "recap", "Keberatan Lisan", "Keberatan disampaikan lisan saat proses bergerak ke agenda berikutnya.", "Keberatan perlu ditangkap secara tepat waktu dan dimasukkan ke jejak proses.", "Bantu Yusuf mencatat keberatan.", "Minta pokok keberatan diperjelas, pastikan dicatat pada media resmi, dan simpan referensinya."],
  ["mira", "Mira", "Pelindung sumber", "watch-village", "Sumber Meminta Rahasia", "Sumber bersedia memberi petunjuk jika identitasnya tidak tersebar.", "Pelindungan sumber harus disertai batas janji, minimisasi data, dan jalur aman.", "Bicarakan perlindungan sumber dengan Mira.", "Jelaskan batas kerahasiaan, minimalkan data identitas, gunakan kanal aman, dan catat persetujuan."],
  ["gilang", "Gilang", "Pemantau ruang digital", "campaign", "Akun yang Menyerupai Resmi", "Sebuah akun menggunakan tampilan yang menyerupai kanal resmi dan menyebarkan klaim.", "Identitas digital, asal konten, dan dampak perlu diverifikasi terpisah.", "Periksa akun bersama Gilang.", "Arsipkan bukti secara proporsional, verifikasi kanal resmi, telusuri konteks, dan hindari memperluas klaim."],
  ["intan", "Intan", "Analis risiko", "planning", "Peta Risiko Berubah", "Informasi terbaru mengubah tingkat risiko pada dua wilayah prioritas.", "Rencana pengawasan harus adaptif, berbasis indikator, dan dapat dijelaskan.", "Perbarui peta risiko bersama Intan.", "Validasi informasi baru, perbarui indikator dan prioritas, lalu dokumentasikan alasan perubahan rencana."],
  ["farid", "Farid", "Koordinator tindak lanjut", "town-hall", "Tekanan untuk Mempercepat", "Ada desakan agar kesimpulan diumumkan sebelum semua sumber penting diperiksa.", "Ketepatan proses dan independensi bukti tidak boleh dikorbankan oleh tekanan.", "Temui Farid untuk menentukan tindak lanjut.", "Jelaskan gap bukti, tetapkan langkah dan waktu verifikasi, serta dokumentasikan tekanan dan keputusan."],
  ["sari", "Sari", "Penghubung komunitas", "watch-village", "Rumor di Pertemuan Warga", "Rumor berulang di forum warga, tetapi asal informasinya belum jelas.", "Partisipasi warga diperkuat dengan literasi verifikasi, bukan penguatan rumor.", "Bantu Sari merespons rumor.", "Akui kekhawatiran, pisahkan fakta dari rumor, ajarkan verifikasi sumber, dan buka kanal informasi awal."],
  ["bagus", "Bagus", "Perancang mitigasi", "planning", "Sumber Daya Terbatas", "Dua lokasi berisiko membutuhkan pemantauan pada waktu yang berdekatan.", "Prioritas harus memakai indikator risiko dan mitigasi yang transparan.", "Susun prioritas bersama Bagus.", "Bandingkan indikator dampak dan kemungkinan, alokasikan sumber daya, serta siapkan mitigasi untuk lokasi lain."],
  ["dewi", "Dewi", "Fasilitator debrief", "determination", "Refleksi Penetapan", "Seluruh catatan pembelajaran perlu dirangkum tanpa menghapus ketidakpastian yang masih ada.", "Kesimpulan yang bertanggung jawab menyatakan dasar, batas, dan tindak lanjut.", "Temui Dewi untuk debrief akhir.", "Rangkum fakta dan prinsip, nyatakan keterbatasan, lalu tetapkan tindak lanjut pembelajaran yang dapat diperiksa."],
] as const;

export const npcs: Npc[] = npcSeeds.map((seed, index) => ({
  id: seed[0],
  name: seed[1],
  role: seed[2],
  buildingId: seed[3],
  missionId: `M${String(index + 1).padStart(2, "0")}`,
  color: ["#2d6a4f", "#277da1", "#9b5de5", "#e76f51", "#bc6c25", "#5f6f52"][index % 6],
}));

export const missions: Mission[] = npcSeeds.map((seed, index) => ({
  id: `M${String(index + 1).padStart(2, "0")}`,
  title: seed[4],
  sequence: index + 1,
  buildingId: seed[3],
  npcId: seed[0],
  context: seed[5],
  principle: seed[6],
  objectiveHint: seed[7],
  bestAction: seed[8],
  legalValidationStatus: "needs-review",
}));

const categoryCycle = ["pembelajaran", "studi_kasus", "audit_bukti", "perlindungan_hak", "jebakan_kognitif", "pelaporan_lhp"];

function makeOptions(mission: Mission, variant: number): QuestionOption[] {
  return [
    {
      id: `${mission.id}-v${variant}-optimal`,
      text: mission.bestAction,
      quality: "best",
      integrityDelta: 2,
      knowledgeDelta: 3,
      reasoningDelta: 3,
      livesDelta: 0,
      feedback: `Tindakan ini paling lengkap karena menjaga fakta, proses, dan jejak pemeriksaan. Prinsip utamanya: ${mission.principle}`,
    },
    {
      id: `${mission.id}-v${variant}-strong`,
      text: "Amankan catatan fakta awal dan konsultasikan kepada koordinator sebelum menentukan langkah lanjutan.",
      quality: "strong",
      integrityDelta: 1,
      knowledgeDelta: 2,
      reasoningDelta: 1,
      livesDelta: 0,
      feedback: "Arah ini masuk akal dan menjaga kehati-hatian, tetapi belum menjelaskan pemeriksaan bukti serta tindak lanjut secara lengkap.",
    },
    {
      id: `${mission.id}-v${variant}-partial`,
      text: "Minta penjelasan dari pihak yang paling dekat dengan kejadian, lalu gunakan penjelasan itu sebagai dasar catatan sementara.",
      quality: "partial",
      integrityDelta: 0,
      knowledgeDelta: 1,
      reasoningDelta: 0,
      livesDelta: 0,
      feedback: "Klarifikasi berguna, tetapi satu pihak belum cukup. Perlu pembanding independen, konteks, dan audit trail.",
    },
    {
      id: `${mission.id}-v${variant}-risky`,
      text: "Sebarkan temuan awal kepada kelompok terkait agar mereka ikut menilai sebelum pemeriksaan selesai.",
      quality: "risky",
      integrityDelta: -2,
      knowledgeDelta: 0,
      reasoningDelta: -1,
      livesDelta: 0,
      feedback: "Partisipasi penting, tetapi menyebarkan temuan yang belum terverifikasi dapat merusak bukti, hak pihak lain, dan independensi pemeriksaan.",
    },
    {
      id: `${mission.id}-v${variant}-fatal`,
      text: "Tetapkan kesimpulan segera dari petunjuk yang paling terlihat agar persoalan cepat selesai.",
      quality: "fatal",
      integrityDelta: -3,
      knowledgeDelta: -1,
      reasoningDelta: -2,
      livesDelta: -1,
      feedback: "Kecepatan tidak menggantikan verifikasi. Kesimpulan dini mengabaikan fakta, perlindungan hak, dan risiko salah klasifikasi.",
    },
  ];
}

const questionPrompts = [
  "Apa tindakan awal yang paling lengkap dan dapat dipertanggungjawabkan?",
  "Dengan fakta yang tersedia, langkah mana yang paling proporsional?",
  "Jika satu detail penting masih belum pasti, respons mana yang paling menjaga kualitas pemeriksaan?",
];

export const questions: Question[] = missions.flatMap((mission, missionIndex) =>
  questionPrompts.map((prompt, variant) => ({
    id: `${mission.id}-Q${variant + 1}`,
    missionId: mission.id,
    category: categoryCycle[(missionIndex + variant) % categoryCycle.length],
    text: prompt,
    timerSeconds: { easy: 0, medium: 20, hard: 10 },
    options: makeOptions(mission, variant + 1),
  })),
);

export function getQuestionForMission(missionId: string, runSeed = 0) {
  const variants = questions.filter((question) => question.missionId === missionId);
  return variants[runSeed % variants.length];
}

export type Badge = { id: string; name: string; description: string; category: string };
export type CodexItem = { id: string; name: string; description: string; topic: string };

export const badges: Badge[] = [
  { id: "orientasi-kelembagaan", name: "Orientasi Kelembagaan", description: "Memahami mandat dan batas kewenangan lembaga pengawasan.", category: "orientasi" },
  { id: "penjaga-hak-pilih", name: "Penjaga Hak Pilih", description: "Melindungi hak pemilih melalui prosedur yang tepat.", category: "perlindungan" },
  { id: "pemeriksa-informasi", name: "Pemeriksa Informasi", description: "Verifikasi sumber sebelum mengklasifikasi temuan.", category: "verifikasi" },
  { id: "penjaga-audit-trail", name: "Penjaga Audit Trail", description: "Menjaga jejak dokumentasi dari awal hingga akhir.", category: "dokumentasi" },
  { id: "tahan-tekanan", name: "Tahan Tekanan", description: "Menolak tekanan yang mengorbankan independensi dan bukti.", category: "integritas" },
  { id: "pemikir-ulang", name: "Pemikir Ulang", description: "Menguji ulang kesimpulan saat fakta baru muncul.", category: "penalaran" },
  { id: "pelindung-sumber", name: "Pelindung Sumber", description: "Menjaga kerahasiaan dan keamanan informan.", category: "perlindungan" },
  { id: "jembatan-warga", name: "Jembatan Warga", description: "Memfasilitasi partisipasi warga dengan literasi verifikasi.", category: "partisipasi" },
  { id: "penjaga-logistik", name: "Penjaga Logistik", description: "Audit distribusi dan rantai penguasaan logistik.", category: "logistik" },
  { id: "pembaca-bukti", name: "Pembaca Bukti", description: "Memisahkan fakta dari interpretasi dalam analisis.", category: "penalaran" },
  { id: "learning-recovery", name: "Learning Recovery", description: "Memperbaiki keputusan setelah feedback nonoptimal.", category: "pembelajaran" },
  { id: "penulis-lhp", name: "Penulis LHP", description: "Menyusun catatan lengkap dengan konteks dan jejak.", category: "dokumentasi" },
  { id: "penjaga-integritas", name: "Penjaga Integritas", description: "Menjaga independensi di seluruh proses pengawasan.", category: "integritas" },
  { id: "audit-sumber-resmi", name: "Audit Sumber Resmi", description: "Verifikasi sumber hukum primer sebelum menyimpulkan.", category: "verifikasi" },
  { id: "kontributor-komunitas", name: "Kontributor Komunitas", description: "Menyumbangkan skenario yang tervalidasi.", category: "partisipasi" },
];

export const codexEntries: CodexItem[] = [
  { id: "mandat-lembaga", name: "Mandat Lembaga", description: "Kewenangan, batas tindakan, dan jalur koordinasi pengawasan.", topic: "lembaga" },
  { id: "quality-gate", name: "Quality Gate", description: "Standar verifikasi sebelum mengklasifikasi atau menyimpulkan.", topic: "prosedur" },
  { id: "data-pemilih", name: "Data Pemilih", description: "Pemeriksaan identitas, jejak pembaruan, dan klarifikasi duplikasi.", topic: "data" },
  { id: "pencalonan", name: "Pencalonan", description: "Verifikasi dokumen, syarat, dan perlindungan hak pencalonan.", topic: "prosedur" },
  { id: "kampanye", name: "Kampanye", description: "Etika informasi, verifikasi klaim, dan konflik kepentingan.", topic: "etika" },
  { id: "logistik", name: "Logistik", description: "Distribusi, segel, formulir, dan rantai penguasaan logistik.", topic: "logistik" },
  { id: "informasi-awal", name: "Informasi Awal", description: "Catatan informasi warga, perlindungan sumber, dan kanal aman.", topic: "pelaporan" },
  { id: "laporan", name: "Laporan", description: "Penyusunan LHP, unsur lengkap, dan jejak pemeriksaan.", topic: "dokumentasi" },
  { id: "hak-di-tps", name: "Hak di TPS", description: "Aksesibilitas, kerahasiaan, dan prosedur penanganan di TPS.", topic: "perlindungan" },
  { id: "penghitungan-lhp", name: "Penghitungan dan LHP", description: "Cocokkan catatan, selisih angka, dan mekanisme koreksi.", topic: "audit" },
  { id: "validasi-sumber", name: "Validasi Sumber", description: "Verifikasi sumber primer, keutuhan bukti, dan batas klaim.", topic: "verifikasi" },
];

export function getBuilding(buildingId: string) {
  return buildings.find((building) => building.id === buildingId);
}

export function getNpc(npcId: string) {
  return npcs.find((npc) => npc.id === npcId);
}

export const difficultyInfo = {
  easy: { label: "Mudah", detail: "Tanpa timer · fokus pengenalan", icon: "🌱" },
  medium: { label: "Sedang", detail: "20 detik · kasus berimbang", icon: "🧭" },
  hard: { label: "Sulit", detail: "10 detik · bukti kompleks", icon: "🔥" },
} satisfies Record<Difficulty, { label: string; detail: string; icon: string }>;
