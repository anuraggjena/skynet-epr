import { Request, Response } from "express"

import {
  fetchEprsByPerson,
  fetchEprById,
  insertEpr,
  editEpr,
  fetchEprSummary,
  getInstructorEprs
} from "../services/epr.service"

import { generateEprRemarks } from "../services/ai.service"

import { eq, and } from "drizzle-orm"
import { db } from "../db"
import { eprRecords } from "../db/schema/eprRecords"

export async function getEprsByPerson(req: Request, res: Response) {

  try {

    const personIdParam = req.query.personId

    if (!personIdParam || typeof personIdParam !== "string") {
      return res.status(400).json({
        message: "personId query param required"
      })
    }

    const eprs = await fetchEprsByPerson(personIdParam)

    res.json(eprs)

  } catch (error) {

    console.error(error)

    res.status(500).json({ message: "Failed to fetch EPRs" })
  }
}



export async function getEprById(req: Request, res: Response) {

  try {

    const idParam = req.params.id

    if (!idParam || typeof idParam !== "string") {
      return res.status(400).json({ message: "Invalid EPR id" })
    }

    const record = await fetchEprById(idParam)

    if (!record) {
      return res.status(404).json({ message: "EPR not found" })
    }

    res.json(record)

  } catch (error) {

    console.error(error)

    res.status(500).json({ message: "Failed to fetch EPR" })
  }
}



export async function getEprSummary(req: Request, res: Response) {

  try {

    const personIdParam = req.params.personId

    if (!personIdParam || typeof personIdParam !== "string") {
      return res.status(400).json({ message: "personId required" })
    }

    const summary = await fetchEprSummary(personIdParam)

    res.json(summary)

  } catch (error) {

    console.error(error)

    res.status(500).json({ message: "Failed to fetch summary" })
  }
}

export async function createEpr(req: Request, res: Response) {

  try {

    const {
      personId,
      periodStart,
      periodEnd
    } = req.body

    if (!personId || !periodStart || !periodEnd) {
      return res.status(400).json({
        message: "personId, periodStart and periodEnd are required"
      })
    }

    const start = new Date(periodStart)
    const end = new Date(periodEnd)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid period dates"
      })
    }

    const existing = await db
      .select()
      .from(eprRecords)
      .where(
        and(
          eq(eprRecords.personId, personId),
          eq(eprRecords.periodStart, start),
          eq(eprRecords.periodEnd, end)
        )
      )
      .limit(1)

    if (existing.length > 0) {

      return res.status(400).json({
        message: "EPR already exists for this evaluation period"
      })

    }

    const newEpr = await insertEpr({
      ...req.body,
      periodStart: start,
      periodEnd: end
    })

    res.status(201).json(newEpr)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to create EPR"
    })

  }

}

export async function updateEpr(req: Request, res: Response) {

  try {

    const idParam = req.params.id

    if (!idParam || typeof idParam !== "string") {
      return res.status(400).json({ message: "Invalid EPR id" })
    }

    const updated = await editEpr(idParam, req.body)

    res.json(updated)

  } catch (error) {

    console.error(error)

    res.status(500).json({ message: "Failed to update EPR" })
  }
}



export async function assistEpr(req: Request, res: Response) {

  try {

    const {
      overallRating,
      technicalSkillsRating,
      nonTechnicalSkillsRating,
      personName,
      role,
      course
    } = req.body

    if (
      typeof overallRating !== "number" ||
      typeof technicalSkillsRating !== "number" ||
      typeof nonTechnicalSkillsRating !== "number"
    ) {
      return res.status(400).json({
        message: "Ratings must be numbers"
      })
    }

    const remarks = await generateEprRemarks(
      overallRating,
      technicalSkillsRating,
      nonTechnicalSkillsRating,
      personName,
      role,
      course
    )

    res.json({
      suggestedRemarks: remarks
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "AI remark generation failed"
    })
  }
}

export async function fetchInstructorEprs(
  req: Request,
  res: Response
) {

  try {

    const { id } = req.params

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        message: "Invalid instructor id"
      })
    }

    const eprs = await getInstructorEprs(id)

    res.json(eprs)

  } catch (error) {

    console.error("Failed to fetch instructor EPRs", error)

    res.status(500).json({
      message: "Failed to fetch instructor EPRs"
    })

  }

}