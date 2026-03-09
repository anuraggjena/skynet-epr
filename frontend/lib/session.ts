export type Role = "admin" | "instructor" | "student"

export type Session = {
  id: string
  role: Role
  name: string
}

const USERS: Session[] = [
  { id: "0b522b79-26fe-4a17-9103-bfe35b71751b", role: "admin", name: "System Admin" },
  { id: "df0c64fe-60be-4ed1-9ffa-c5ce7b628995", role: "instructor", name: "David Reynolds" },
  { id: "f5c08268-cda8-42a9-a2ae-af7c5e19c62e", role: "student", name: "Sneha Iyer" }
]

export function getUsers() {
  return USERS
}

export function getSession(): Session {

  if (typeof window === "undefined") {
    return USERS[0]
  }

  const stored = localStorage.getItem("session")

  if (stored) return JSON.parse(stored)

  localStorage.setItem("session", JSON.stringify(USERS[0]))

  return USERS[0]
}

export function setSession(user: Session) {
  localStorage.setItem("session", JSON.stringify(user))
}