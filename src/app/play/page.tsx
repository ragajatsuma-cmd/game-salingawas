import type { Metadata } from "next";
import GameExperience from "./GameExperience";

export const metadata: Metadata = {
  title: "Mainkan Simulasi",
  description: "Masuk ke desa pembelajaran Pengawas Partisipatif.",
  robots: { index: false, follow: false },
};

export default function PlayPage() {
  return <GameExperience />;
}
