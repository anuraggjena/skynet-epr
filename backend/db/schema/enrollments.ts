import {
  pgTable,
  uuid,
  timestamp,
  pgEnum
} from "drizzle-orm/pg-core"

import { users } from "./users"
import { courses } from "./courses"

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "completed",
  "dropped"
])

export const enrollments = pgTable("enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),

  studentId: uuid("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "restrict" })
    .notNull(),

  startDate: timestamp("start_date").notNull(),

  status: enrollmentStatusEnum("status").notNull()
})