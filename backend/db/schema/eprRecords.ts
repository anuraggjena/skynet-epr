import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  pgEnum,
  index,
  uniqueIndex
} from "drizzle-orm/pg-core"
import { users } from "./users"

export const roleTypeEnum = pgEnum("role_type", [
  "student",
  "instructor"
])

export const eprStatusEnum = pgEnum("epr_status", [
  "draft",
  "submitted",
  "archived"
])

export const eprRecords = pgTable(
  "epr_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    personId: uuid("person_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    evaluatorId: uuid("evaluator_id")
      .references(() => users.id, { onDelete: "restrict" })
      .notNull(),

    roleType: roleTypeEnum("role_type").notNull(),

    periodStart: timestamp("period_start").notNull(),

    periodEnd: timestamp("period_end").notNull(),

    overallRating: integer("overall_rating").notNull(),

    technicalSkillsRating: integer("technical_skills_rating").notNull(),

    nonTechnicalSkillsRating: integer("non_technical_skills_rating").notNull(),

    remarks: text("remarks"),

    status: eprStatusEnum("status").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull()
  },
  (table) => ({
    personIndex: index("person_idx").on(table.personId),

    evaluatorIndex: index("evaluator_idx").on(table.evaluatorId),

    periodIndex: index("period_idx").on(
      table.periodStart,
      table.periodEnd
    ),
    uniquePersonPeriod: uniqueIndex("unique_person_period")
    .on(table.personId, table.periodStart),
  })
)