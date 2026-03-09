import { db } from "../db"
import { users } from "../db/schema"
import { eprRecords } from "../db/schema/eprRecords"

import { eq, desc } from "drizzle-orm"

export async function fetchEprsByPerson(personId: string) {

  return db
    .select()
    .from(eprRecords)
    .where(eq(eprRecords.personId, personId))
    .orderBy(desc(eprRecords.periodStart))
}

export async function fetchEprById(id: string) {

  const result = await db
    .select()
    .from(eprRecords)
    .where(eq(eprRecords.id, id))
    .limit(1)

  return result[0] ?? null
}

export async function insertEpr(data: typeof eprRecords.$inferInsert) {

  const payload = {
    ...data,
    periodStart: new Date(data.periodStart as any),
    periodEnd: new Date(data.periodEnd as any)
  }

  const result = await db
    .insert(eprRecords)
    .values(payload)
    .returning()

  return result[0]
}

export async function editEpr(
  id: string,
  updates: Partial<typeof eprRecords.$inferInsert>
) {

  const result = await db
    .update(eprRecords)
    .set({
      ...updates,
      updatedAt: new Date()
    })
    .where(eq(eprRecords.id, id))
    .returning()

  return result[0]
}

export async function fetchEprSummary(personId: string) {

  const records = await fetchEprsByPerson(personId)

  if (!records.length) {

    return {
      personId,
      eprCount: 0,
      averageOverallRating: 0,
      averageTechnicalRating: 0,
      averageNonTechnicalRating: 0,
      trend: "stable",
      lastThreePeriods: []
    }
  }

  const eprCount = records.length

  const avgOverall =
    records.reduce((s, r) => s + r.overallRating, 0) / eprCount

  const avgTech =
    records.reduce((s, r) => s + r.technicalSkillsRating, 0) / eprCount

  const avgNonTech =
    records.reduce((s, r) => s + r.nonTechnicalSkillsRating, 0) / eprCount

  const latest = records[0]?.overallRating ?? avgOverall

  let trend = "stable"

  if (latest > avgOverall) trend = "improving"
  if (latest < avgOverall) trend = "declining"

  const lastThreePeriods = records.slice(0, 3).map((r) => {

    const d = new Date(r.periodStart)

    const quarter = Math.ceil((d.getMonth() + 1) / 3)

    return {
      periodLabel: `Q${quarter} ${d.getFullYear()}`,
      overallRating: r.overallRating ?? 0
    }
  })

  return {
    personId,
    eprCount,
    averageOverallRating: Number(avgOverall.toFixed(2)),
    averageTechnicalRating: Number(avgTech.toFixed(2)),
    averageNonTechnicalRating: Number(avgNonTech.toFixed(2)),
    trend,
    lastThreePeriods
  }
}

export async function getInstructorEprs(instructorId: string) {

  const rows = await db
    .select({
      id: eprRecords.id,

      studentId: users.id,
      studentName: users.name,
      studentEmail: users.email,

      overallRating: eprRecords.overallRating,
      technicalSkillsRating: eprRecords.technicalSkillsRating,
      nonTechnicalSkillsRating: eprRecords.nonTechnicalSkillsRating,

      periodStart: eprRecords.periodStart,
      periodEnd: eprRecords.periodEnd,

      status: eprRecords.status,
      remarks: eprRecords.remarks,

      createdAt: eprRecords.createdAt
    })
    .from(eprRecords)
    .leftJoin(users, eq(users.id, eprRecords.personId))
    .where(eq(eprRecords.evaluatorId, instructorId))

  return rows
}