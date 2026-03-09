import { Request, Response } from "express"
import { fetchPeople } from "../services/people.service"

export async function getPeople(req: Request, res: Response) {

  try {

    const role = req.query.role as string | undefined
    const search = req.query.search as string | undefined

    // logged-in user
    const user = (req as any).user

    const evaluatorId =
      user?.role === "instructor"
        ? user.id
        : undefined

    const people = await fetchPeople(
      role,
      search,
      evaluatorId
    )

    res.json(people)

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to fetch people"
    })

  }

}