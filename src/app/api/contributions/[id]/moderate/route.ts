import { db } from "@/db";
import { contributions } from "@/db/schema";
import { eq } from "drizzle-orm";

const allowedActions = new Set(["approve", "reject"]);

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const action = typeof body.action === "string" ? body.action : "";
    const reviewerNotes = typeof body.reviewerNotes === "string" ? body.reviewerNotes.slice(0, 500) : null;

    if (!allowedActions.has(action)) {
      return Response.json({ error: "Aksi tidak valid. Gunakan approve atau reject." }, { status: 400 });
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const updated = await db
      .update(contributions)
      .set({ status: newStatus, reviewerNotes, updatedAt: new Date() })
      .where(eq(contributions.id, id))
      .returning({ id: contributions.id, status: contributions.status });

    if (updated.length === 0) {
      return Response.json({ error: "Kontribusi tidak ditemukan." }, { status: 404 });
    }

    return Response.json({ id: updated[0].id, status: updated[0].status });
  } catch {
    return Response.json({ error: "Moderasi belum dapat dilakukan." }, { status: 500 });
  }
}
