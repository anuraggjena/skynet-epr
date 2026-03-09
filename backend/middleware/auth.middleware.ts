import { Request, Response, NextFunction } from "express"

export function requireAuth(req: Request, res: Response, next: NextFunction) {

  const userId = req.headers["x-user-id"]
  const role = req.headers["x-user-role"]

  if (!userId || typeof userId !== "string") {
    return res.status(401).json({ message: "Missing user id" })
  }

  if (!role || typeof role !== "string") {
    return res.status(401).json({ message: "Missing user role" })
  }

  ;(req as any).user = {
    id: userId,
    role
  }

  next()
}

export function allowRoles(...allowedRoles: string[]) {

  return (req: Request, res: Response, next: NextFunction) => {

    const user = (req as any).user

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" })
    }

    next()
  }
}

export function restrictStudentAccess(req: Request, res: Response, next: NextFunction) {

  const user = (req as any).user

  if (user.role !== "student") {
    return next()
  }

  const personId = req.query.personId

  if (personId !== user.id) {
    return res.status(403).json({
      message: "Students can only view their own records"
    })
  }

  next()
}