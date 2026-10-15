import { sqliteTable, text, integer, real, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const actions = sqliteTable("family_actions", {
  id: text("id").primaryKey(), ownerId: text("owner_id").notNull(), household: text("household").notNull(),
  date: text("date").notNull(), week: integer("week").notNull(), setting: text("setting").notNull(),
  action: text("action").notNull(), applies: integer("applies", { mode: "boolean" }).notNull(),
  completed: integer("completed", { mode: "boolean" }), barrier: text("barrier").notNull(),
  minutes: integer("minutes"), isExample: integer("is_example", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull(),
}, (t) => [index("actions_owner").on(t.ownerId), index("actions_owner_household").on(t.ownerId, t.household)]);

export const surveys = sqliteTable("family_surveys", {
  id: text("id").primaryKey(), ownerId: text("owner_id").notNull(), household: text("household").notNull(),
  date: text("date").notNull(), moment: text("moment").notNull(), knowledge: text("knowledge_json").notNull(),
  habits: text("habits_json").notNull(), attitudes: text("attitudes_json").notNull(),
  createdAt: text("created_at").notNull(),
}, (t) => [index("surveys_owner").on(t.ownerId), uniqueIndex("surveys_owner_household_moment").on(t.ownerId, t.household, t.moment)]);

export const bills = sqliteTable("family_bills", {
  id: text("id").primaryKey(), ownerId: text("owner_id").notNull(), household: text("household").notNull(),
  start: text("cycle_start").notNull(), end: text("cycle_end").notNull(), days: integer("days").notNull(),
  kwh: real("kwh").notNull(), occupants: integer("occupants"), event: text("event").notNull(),
  createdAt: text("created_at").notNull(),
}, (t) => [index("bills_owner").on(t.ownerId), uniqueIndex("bills_owner_household_cycle").on(t.ownerId, t.household, t.start, t.end)]);
