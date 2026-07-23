import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://game.ragajatsuma.my.id"),
  title: {
    default: "Pengawas Partisipatif — Simulasi Pembelajaran Pemilu",
    template: "%s | Pengawas Partisipatif",
  },
  description:
    "Game web edukasi berbasis simulasi naratif untuk belajar mengamati fakta, menjaga integritas, dan mengambil keputusan pengawasan yang dapat dipertanggungjawabkan.",
  applicationName: "Pengawas Partisipatif",
  manifest: "/manifest.webmanifest",
  keywords: ["game edukasi", "pengawasan partisipatif", "pemilu", "pilkada", "simulasi pembelajaran"],
  authors: [{ name: "Raga Jatsuma", url: "https://game.ragajatsuma.my.id" }],
  creator: "Raga Jatsuma",
  openGraph: {
    title: "Pengawas Partisipatif",
    description: "Belajar mengawasi lewat cerita, bukti, dan keputusan.",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/images/desa-pengawasan-map.jpg", width: 1200, height: 675, alt: "Ilustrasi desa pembelajaran Pengawas Partisipatif" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#214b35",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
