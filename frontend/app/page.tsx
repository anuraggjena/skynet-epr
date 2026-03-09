"use client"

import { useEffect, useState } from "react"
import { getSession } from "@/lib/session"

import AdminDashboard from "@/components/dashboard/admin-dashboard"
import InstructorDashboard from "@/components/dashboard/instructor-dashboard"
import StudentDashboard from "@/components/dashboard/student-dashboard"

type Session = {
  id: string
  role: "admin" | "instructor" | "student"
}

export default function DashboardRouter() {

  const [session, setSession] = useState<Session | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setSession(getSession())
    setMounted(true)
  }, [])

  if (!mounted || !session) return null

  if (session.role === "admin") {
    return <AdminDashboard session={session} />
  }

  if (session.role === "instructor") {
    return <InstructorDashboard session={session} />
  }

  return <StudentDashboard session={session} />
}