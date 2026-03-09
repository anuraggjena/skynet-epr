import { Router } from "express"
import { getPeople } from "../controllers/people.controller"
import { requireAuth } from "../middleware/auth.middleware"

const router = Router()

router.use(requireAuth)

router.get("/", getPeople)

export default router