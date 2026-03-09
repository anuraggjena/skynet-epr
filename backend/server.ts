import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import peopleRoutes from "./routes/people.routes"
import eprRoutes from "./routes/epr.routes"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/people", peopleRoutes)
app.use("/api/epr", eprRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})