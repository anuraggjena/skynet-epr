export type Role = "admin" | "instructor" | "student"

export type Session = {
  id: string
  role: Role
  name: string
}

const USERS: Session[] = [
  { id: "5bc3a4d1-f1d5-4bba-a67b-6c678aea7468", role: "admin", name: "System Admin" },
  { id: "77d0e81e-c412-47d3-99f5-d65c033237c7", role: "instructor", name: "David Reynolds" },
  { id: "98669d27-7263-45c0-a218-63f3d908930f", role: "student", name: "Sneha Iyer" }
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
