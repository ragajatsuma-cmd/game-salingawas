import { db } from "@/db";
import { gameAnswers, gameRuns } from "@/db/schema";
import { eq } from "drizzle-orm";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const qualities = new Set(["best", "strong", "partial", "risky", "fatal"]);
const safeNumber = (value: unknown, min: number, max: number) => typeof value === "number" && Number.isFinite(value) ? Math.max(min, Math.min(max, Math.round(value))) : min;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const runId = typeof body.runId === "string" ? body.runId : "";
    const questionId = typeof body.questionId === "string" ? body.questionId.slice(0, 40) : "";
    const selectedOptionId = typeof body.selectedOptionId === "string" ? body.selectedOptionId.slice(0, 80) : "";
    const quality = typeof body.quality === "string" ? body.quality : "";
    const rawStats = body.statsAfter && typeof body.statsAfter === "object" ? body.statsAfter as Record<string, unknown> : {};
    const statsAfter = {
      lives: safeNumber(rawStats.lives, 0, 3),
      integrity: safeNumber(rawStats.integrity, 0, 100),
      knowledge: safeNumber(rawStats.knowledge, 0, 100),
      reasoning: safeNumber(rawStats.reasoning, 0, 100),
    };

    if (!uuidPattern.test(runId) || !questionId || !selectedOptionId || !qualities.has(quality)) {
      return Response.json({ error: "Jawaban tidak valid." }, { status: 400 });
    }

    const inserted = await db
      .insert(gameAnswers)
      .values({
        runId,
        questionId,
        selectedOptionId,
        quality,
        responseTimeMs: safeNumber(body.responseTimeMs, 0, 600_000),
        timerExpired: body.timerExpired === true,
        statsAfter,
      })
      .onConflictDoNothing({ target: [gameAnswers.runId, gameAnswers.questionId] })
      .returning({ id: gameAnswers.id });

    if (inserted.length > 0) {
      await db
        .update(gameRuns)
        .set({
          livesRemaining: statsAfter.lives,
          stats: { integrity: statsAfter.integrity, knowledge: statsAfter.knowledge, reasoning: statsAfter.reasoning },
          missionIndex: safeNumber(body.missionIndex, 0, 26),
        })
        .where(eq(gameRuns.id, runId));
    }

    return Response.json({ committed: inserted.length > 0, duplicate: inserted.length === 0 });
  } catch {
    return Response.json({ error: "Jawaban belum dapat dikomit." }, { status: 500 });
  }
}
