import { Router } from "express"

import {
  getEprsByPerson,
  getEprById,
  createEpr,
  updateEpr,
  getEprSummary,
  assistEpr,
  fetchInstructorEprs
} from "../controllers/epr.controller"

import {
  requireAuth,
  allowRoles,
  restrictStudentAccess
} from "../middleware/auth.middleware"

const router = Router()

router.use(requireAuth)

router.get("/", restrictStudentAccess, getEprsByPerson)

router.get("/summary/:personId", getEprSummary)

router.get("/:id", getEprById)

router.get("/instructor/:id", fetchInstructorEprs)

router.post(
  "/",
  allowRoles("admin", "instructor"),
  createEpr
)

router.patch(
  "/:id",
  allowRoles("admin", "instructor"),
  updateEpr
)

router.post("/assist", assistEpr)

export default router