import { db } from "@/db";
import { gameRuns, globalStats } from "@/db/schema";
import { and, eq, isNull, sql } from "drizzle-orm";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const endings = new Set(["sukses-pengawas", "perlu-pembinaan"]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const runId = typeof body.runId === "string" ? body.runId : "";
    const endingId = typeof body.endingId === "string" ? body.endingId : "";
    const completionSeconds = typeof body.completionSeconds === "number" ? Math.max(1, Math.min(604_800, Math.round(body.completionSeconds))) : null;

    if (!uuidPattern.test(runId) || !endings.has(endingId) || !completionSeconds) {
      return Response.json({ error: "Data penyelesaian tidak valid." }, { status: 400 });
    }

    const updated = await db
      .update(gameRuns)
      .set({ completedAt: new Date(), completionSeconds, endingId, validForLeaderboard: false })
      .where(and(eq(gameRuns.id, runId), isNull(gameRuns.completedAt)))
      .returning({ id: gameRuns.id });

    if (updated.length > 0) {
      await db
        .insert(globalStats)
        .values({ id: "global", totalCompletedRuns: 1 })
        .onConflictDoUpdate({
          target: globalStats.id,
          set: {
            totalCompletedRuns: sql`${globalStats.totalCompletedRuns} + 1`,
            updatedAt: new Date(),
          },
        });
    }

    return Response.json({ completed: updated.length > 0, duplicate: updated.length === 0 });
  } catch {
    return Response.json({ error: "Run belum dapat diselesaikan." }, { status: 500 });
  }
}
