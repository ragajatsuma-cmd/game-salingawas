import { createHash } from "node:crypto";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { buildings, missions, npcs, questions } from "@/lib/game-content";

export async function GET(request: Request) {
  const configuredToken = process.env.ADMIN_EXPORT_TOKEN;
  const providedToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!configuredToken || providedToken !== configuredToken) {
    return Response.json({ error: "Admin authentication required." }, { status: 401 });
  }

  const buildingIds = new Set(buildings.map((item) => item.id));
  const npcIds = new Set(npcs.map((item) => item.id));
  const missionIds = new Set(missions.map((item) => item.id));
  const relationErrors = [
    ...npcs.filter((npc) => !buildingIds.has(npc.buildingId)).map((npc) => `NPC orphan: ${npc.id}`),
    ...missions.filter((mission) => !buildingIds.has(mission.buildingId) || !npcIds.has(mission.npcId)).map((mission) => `Mission orphan: ${mission.id}`),
    ...questions.filter((question) => !missionIds.has(question.missionId)).map((question) => `Question orphan: ${question.id}`),
  ];

  if (relationErrors.length > 0) {
    return Response.json({ error: "Export dihentikan karena relasi tidak valid.", details: relationErrors }, { status: 409 });
  }

  const exportedQuestions = questions.map(({ options: _options, ...question }) => question);
  const options = questions.flatMap((question) => question.options.map((option, displayOrder) => ({ ...option, questionId: question.id, displayOrder })));
  const payload = {
    metadata: {
      schemaVersion: "1.0.0",
      appVersion: "0.1.0-prototype",
      exportedAt: new Date().toISOString(),
      legalValidationStatus: "needs-review",
    },
    buildings,
    npcs,
    missions,
    questions: exportedQuestions,
    options,
    dialogues: missions.map((mission) => ({
      missionId: mission.id,
      npcId: mission.npcId,
      observation: mission.context,
      briefing: mission.principle,
      playerAcknowledgement: "Saya akan memeriksa fakta sebelum menyimpulkan.",
      questionTrigger: "Tentukan respons yang paling lengkap dan proporsional.",
    })),
    badges: [],
    codex: [],
    endings: [
      { id: "sukses-pengawas", name: "Sukses Menjadi Pengawas", accessTier: "free" },
      { id: "perlu-pembinaan", name: "Gagal Menjadi Pengawas", accessTier: "free" },
    ],
    tutorials: [],
  };
  const serialized = JSON.stringify(payload);
  const checksum = createHash("sha256").update(serialized).digest("hex");
  const finalPayload = { ...payload, metadata: { ...payload.metadata, checksum } };
  const format = new URL(request.url).searchParams.get("format") === "json" ? "json" : "js";
  const content = format === "json" ? JSON.stringify(finalPayload, null, 2) : `window.GAME_CONTENT = ${JSON.stringify(finalPayload, null, 2)};\n`;

  await db.insert(auditLogs).values({
    action: "export_content_package",
    entityType: "content_package",
    entityId: checksum,
    metadata: { format, schemaVersion: "1.0.0" },
  });

  return new Response(content, {
    headers: {
      "Content-Type": format === "json" ? "application/json; charset=utf-8" : "application/javascript; charset=utf-8",
      "Content-Disposition": `attachment; filename="game-content.${format}"`,
      "Cache-Control": "no-store",
      "X-Content-Checksum": checksum,
    },
  });
}
