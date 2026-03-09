import { db } from "../db"
import { users } from "./schema/users"
import { courses } from "./schema/courses"
import { enrollments } from "./schema/enrollments"
import { eprRecords } from "./schema/eprRecords"

async function seed() {

  console.log("🌱 Starting database seed...")

  /* ------------------ ADMIN ------------------ */

  const admin = await db
    .insert(users)
    .values({
      name: "System Admin",
      email: "admin@airman.com",
      role: "admin"
    })
    .returning()

  console.log("✅ Admin seeded")

  /* ------------------ INSTRUCTORS ------------------ */

  const instructors = await db
    .insert(users)
    .values([
      {
        name: "Michael Carter",
        email: "michael.carter@airman.com",
        role: "instructor"
      },
      {
        name: "Sarah Mitchell",
        email: "sarah.mitchell@airman.com",
        role: "instructor"
      },
      {
        name: "David Reynolds",
        email: "david.reynolds@airman.com",
        role: "instructor"
      },
      {
        name: "James Peterson",
        email: "james.peterson@airman.com",
        role: "instructor"
      },
      {
        name: "Olivia Walker",
        email: "olivia.walker@airman.com",
        role: "instructor"
      }
    ])
    .returning()

  console.log("✅ Instructors seeded")

  /* ------------------ STUDENTS ------------------ */

  const students = await db
    .insert(users)
    .values([
      { name: "Rahul Sharma", email: "rahul@airman.com", role: "student" },
      { name: "Aman Gupta", email: "aman@airman.com", role: "student" },
      { name: "Neha Verma", email: "neha@airman.com", role: "student" },
      { name: "Karan Mehta", email: "karan@airman.com", role: "student" },
      { name: "Priya Nair", email: "priya@airman.com", role: "student" },
      { name: "Arjun Singh", email: "arjun@airman.com", role: "student" },
      { name: "Riya Kapoor", email: "riya@airman.com", role: "student" },
      { name: "Vikram Patel", email: "vikram@airman.com", role: "student" },
      { name: "Sneha Iyer", email: "sneha@airman.com", role: "student" },
      { name: "Aditya Kulkarni", email: "aditya@airman.com", role: "student" },
      { name: "Kabir Malhotra", email: "kabir@airman.com", role: "student" },
      { name: "Tanya Arora", email: "tanya@airman.com", role: "student" },
      { name: "Ishaan Kapoor", email: "ishaan@airman.com", role: "student" },
      { name: "Ananya Das", email: "ananya@airman.com", role: "student" },
      { name: "Dev Khanna", email: "dev@airman.com", role: "student" }
    ])
    .returning()

  console.log("✅ Students seeded")

  /* ------------------ COURSES ------------------ */

  const createdCourses = await db
    .insert(courses)
    .values([
      {
        name: "PPL Program",
        licenseType: "PPL",
        totalRequiredHours: "45"
      },
      {
        name: "CPL Integrated",
        licenseType: "CPL",
        totalRequiredHours: "200"
      },
      {
        name: "ATPL Preparation",
        licenseType: "ATPL",
        totalRequiredHours: "150"
      },
      {
        name: "Instrument Rating",
        licenseType: "IR",
        totalRequiredHours: "50"
      }
    ])
    .returning()

  console.log("✅ Courses seeded")

  /* ------------------ ENROLLMENTS ------------------ */

  const enrollmentData = students.map((student, index) => ({
    studentId: student.id,
    courseId: createdCourses[index % createdCourses.length]!.id,
    startDate: new Date("2025-01-01"),
    status: "active" as const
  }))

  await db.insert(enrollments).values(enrollmentData)

  console.log("✅ Enrollments seeded")

  /* ------------------ EPR PERIODS ------------------ */

  const periods = [
    { start: new Date("2024-01-01"), end: new Date("2024-03-31") },
    { start: new Date("2024-04-01"), end: new Date("2024-06-30") },
    { start: new Date("2024-07-01"), end: new Date("2024-09-30") },
    { start: new Date("2024-10-01"), end: new Date("2024-12-31") },
    { start: new Date("2025-01-01"), end: new Date("2025-03-31") }
  ]

  const ratings = [2, 3, 4, 5]

  const remarksPool = [
    "Shows strong situational awareness and cockpit discipline.",
    "Good theoretical understanding with improving flight execution.",
    "Excellent communication and teamwork during simulator sessions.",
    "Needs improvement in checklist discipline and workload management.",
    "Demonstrates strong decision making in navigation scenarios.",
    "Performance improving steadily with better procedural accuracy.",
    "Displays good CRM (Crew Resource Management) during training.",
    "Requires improvement in radio communication clarity."
  ]

  /* ------------------ EPR RECORDS ------------------ */

  const eprData: typeof eprRecords.$inferInsert[] = []

  for (const student of students) {

    for (const period of periods) {

      const instructor =
        instructors[Math.floor(Math.random() * instructors.length)]

      if (!instructor) continue

      const overall = ratings[Math.floor(Math.random() * ratings.length)] ?? 4
      const technical = ratings[Math.floor(Math.random() * ratings.length)] ?? 4
      const nonTechnical = ratings[Math.floor(Math.random() * ratings.length)] ?? 4

      eprData.push({
        personId: student.id,
        evaluatorId: instructor.id,
        roleType: "student",

        periodStart: period.start,
        periodEnd: period.end,

        overallRating: overall,
        technicalSkillsRating: technical,
        nonTechnicalSkillsRating: nonTechnical,

        remarks:
          remarksPool[Math.floor(Math.random() * remarksPool.length)],

        status: "submitted"
      })
    }
  }

  await db.insert(eprRecords).values(eprData)

  console.log("✅ EPR records seeded")

  console.log("🎉 Database seed completed successfully")

  process.exit(0)
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err)
  process.exit(1)
})