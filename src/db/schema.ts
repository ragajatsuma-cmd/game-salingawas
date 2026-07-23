import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  authUserId: text("auth_user_id").unique(),
  fullName: text("full_name"),
  displayName: text("display_name").notNull(),
  region: text("region"),
  role: text("role").notNull().default("user"),
  subscriptionTier: text("subscription_tier").notNull().default("free"),
  tutorialCompleted: boolean("tutorial_completed").notNull().default(false),
  privacySettings: jsonb("privacy_settings").$type<Record<string, boolean>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const gameRuns = pgTable("game_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  guestSessionId: text("guest_session_id"),
  playerAlias: text("player_alias").notNull(),
  region: text("region").notNull(),
  difficulty: text("difficulty").notNull(),
  accessTier: text("access_tier").notNull().default("free"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  completionSeconds: integer("completion_seconds"),
  livesRemaining: integer("lives_remaining").notNull().default(3),
  missionIndex: integer("mission_index").notNull().default(0),
  stats: jsonb("stats").$type<{ integrity: number; knowledge: number; reasoning: number }>().notNull().default({ integrity: 50, knowledge: 10, reasoning: 10 }),
  endingId: text("ending_id"),
  validForLeaderboard: boolean("valid_for_leaderboard").notNull().default(false),
  integrityHash: text("integrity_hash"),
  appVersion: text("app_version").notNull().default("0.1.0-prototype"),
});

export const gameAnswers = pgTable(
  "game_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    runId: uuid("run_id").notNull().references(() => gameRuns.id, { onDelete: "cascade" }),
    questionId: text("question_id").notNull(),
    selectedOptionId: text("selected_option_id").notNull(),
    quality: text("quality").notNull(),
    responseTimeMs: integer("response_time_ms").notNull().default(0),
    timerExpired: boolean("timer_expired").notNull().default(false),
    statsAfter: jsonb("stats_after").$type<Record<string, number>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("answers_run_question_unique").on(table.runId, table.questionId)],
);

export const contributions = pgTable("contributions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  guestAlias: text("guest_alias"),
  contributionType: text("contribution_type").notNull().default("scenario"),
  title: text("title").notNull(),
  scenarioText: text("scenario_text").notNull(),
  proposedReasoning: text("proposed_reasoning"),
  sources: text("sources"),
  status: text("status").notNull().default("draft"),
  reviewerId: uuid("reviewer_id").references(() => profiles.id, { onDelete: "set null" }),
  reviewerNotes: text("reviewer_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const globalStats = pgTable("global_stats", {
  id: text("id").primaryKey().default("global"),
  totalRegisteredUsers: integer("total_registered_users").notNull().default(0),
  totalValidRuns: integer("total_valid_runs").notNull().default(0),
  totalCompletedRuns: integer("total_completed_runs").notNull().default(0),
  totalPublishedContributions: integer("total_published_contributions").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: uuid("actor_id").references(() => profiles.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
