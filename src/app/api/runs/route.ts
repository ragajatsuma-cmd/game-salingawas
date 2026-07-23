import { db } from "@/db";
import { gameRuns } from "@/db/schema";

const allowedDifficulties = new Set(["easy", "medium", "hard"]);
const clean = (value: unknown, max: number) => typeof value === "string" ? value.replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const playerAlias = clean(body.alias, 32);
    const region = clean(body.region, 64);
    const difficulty = clean(body.difficulty, 12);
    const guestSessionId = clean(body.guestSessionId, 80);

    if (!playerAlias || !region || !guestSessionId || !allowedDifficulties.has(difficulty)) {
      return Response.json({ error: "Data run tidak valid." }, { status: 400 });
    }

    const [run] = await db
      .insert(gameRuns)
      .values({ playerAlias, region, difficulty, guestSessionId })
      .returning({ id: gameRuns.id });

    return Response.json({ id: run.id }, { status: 201 });
  } catch {
    return Response.json({ error: "Run belum dapat disimpan." }, { status: 500 });
  }
}
