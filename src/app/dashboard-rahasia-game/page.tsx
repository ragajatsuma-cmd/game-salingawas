import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contributions, gameAnswers, gameRuns, profiles } from "@/db/schema";
import AdminDashboard from "./AdminDashboard";

export const dynamic = "force-dynamic";

async function getAdminData() {
  try {
    const [runsResult] = await db.select({ value: count() }).from(gameRuns);
    const [answersResult] = await db.select({ value: count() }).from(gameAnswers);
    const [pendingResult] = await db.select({ value: count() }).from(contributions).where(eq(contributions.status, "pending"));

    const serverStats = {
      runs: Number(runsResult.value ?? 0),
      answers: Number(answersResult.value ?? 0),
      pending: Number(pendingResult.value ?? 0),
    };

    const serverContributions = await db
      .select({
        id: contributions.id,
        guestAlias: contributions.guestAlias,
        contributionType: contributions.contributionType,
        title: contributions.title,
        scenarioText: contributions.scenarioText,
        proposedReasoning: contributions.proposedReasoning,
        sources: contributions.sources,
        status: contributions.status,
        createdAt: contributions.createdAt,
      })
      .from(contributions)
      .orderBy(desc(contributions.createdAt))
      .limit(50);

    const serverUsers = await db
      .select({
        id: profiles.id,
        displayName: profiles.displayName,
        region: profiles.region,
        role: profiles.role,
        createdAt: profiles.createdAt,
      })
      .from(profiles)
      .orderBy(desc(profiles.createdAt))
      .limit(50);

    const serializedContributions = serverContributions.map((c) => ({
      ...c,
      id: String(c.id),
      createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    }));

    const serializedUsers = serverUsers.map((u) => ({
      ...u,
      id: String(u.id),
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
    }));

    return { serverStats, serverContributions: serializedContributions, serverUsers: serializedUsers };
  } catch {
    return {
      serverStats: { runs: 0, answers: 0, pending: 0 },
      serverContributions: [],
      serverUsers: [],
    };
  }
}

export default async function AdminDashboardPage() {
  const data = await getAdminData();
  return <AdminDashboard serverStats={data.serverStats} serverContributions={data.serverContributions} serverUsers={data.serverUsers} />;
}
