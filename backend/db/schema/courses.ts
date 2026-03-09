import { pgTable, uuid, text, numeric } from "drizzle-orm/pg-core"

export const courses = pgTable("courses", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  licenseType: text("license_type").notNull(),

  totalRequiredHours: numeric("total_required_hours", {
    precision: 6,
    scale: 2
  }).notNull()
})