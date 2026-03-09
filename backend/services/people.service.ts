import { db } from "../db"
import { users } from "../db/schema/users"
import { enrollments } from "../db/schema/enrollments"
import { courses } from "../db/schema/courses"
import { eprRecords } from "../db/schema/eprRecords"

import { eq, ilike, and } from "drizzle-orm"

export async function fetchPeople(
  role?: string,
  search?: string,
  evaluatorId?: string
) {

  const conditions = []

  if (role) {
    conditions.push(eq(users.role, role as any))
  }

  if (search) {
    conditions.push(ilike(users.name, `%${search}%`))
  }

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      courseName: courses.name,
      enrollmentStatus: enrollments.status
    })
    .from(users)
    .leftJoin(enrollments, eq(enrollments.studentId, users.id))
    .leftJoin(courses, eq(courses.id, enrollments.courseId))
    .where(conditions.length ? and(...conditions) : undefined)

  const eprs = await db.select().from(eprRecords)

  const people = rows.map((p) => {

    const studentEprs = eprs.filter(
      (e) => e.personId === p.id
    )

    const instructorEprs = eprs.filter(
      (e) => e.evaluatorId === p.id
    )

    let averageRating = 0
    let latestRating = 0

    if (studentEprs.length > 0) {

      averageRating =
        studentEprs.reduce((sum, r) => sum + r.overallRating, 0) /
        studentEprs.length

      const latest = studentEprs
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )[0]

      latestRating = latest?.overallRating ?? 0
    }

    let trend: "improving" | "declining" | "stable" = "stable"

    if (latestRating > averageRating) trend = "improving"
    else if (latestRating < averageRating) trend = "declining"

    return {
      ...p,
      averageRating: Number(averageRating.toFixed(2)),
      latestRating,
      trend,
      eprCount: instructorEprs.length
    }

  })

  if (!evaluatorId) return people

  const instructorStudentIds = new Set(
    eprs
      .filter((e) => e.evaluatorId === evaluatorId)
      .map((e) => e.personId)
  )

  return people.filter((p) =>
    p.role === "student" && instructorStudentIds.has(p.id)
  )
}