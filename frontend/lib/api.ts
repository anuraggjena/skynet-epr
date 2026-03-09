import { getSession } from "./session"

const API = process.env.NEXT_PUBLIC_API_URL

function authHeaders() {

  const session = getSession()

  return {
    "Content-Type": "application/json",
    "x-user-id": session.id,
    "x-user-role": session.role
  }
}

export async function getPeople() {

  const res = await fetch(`${API}/people`, {
    headers: authHeaders()
  })

  return res.json()
}

export async function getPersonEprs(personId: string) {

  const res = await fetch(`${API}/epr?personId=${personId}`, {
    headers: authHeaders()
  })

  return res.json()
}

export async function getSummary(personId: string) {

  const res = await fetch(`${API}/epr/summary/${personId}`, {
    headers: authHeaders()
  })

  return res.json()
}

export async function generateRemarks(payload: any) {

  const res = await fetch(`${API}/epr/assist`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload)
  })

  return res.json()
}

export async function createEpr(payload: any) {

  const res = await fetch(`${API}/epr`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload)
  })

  return res.json()
}

export async function updateEpr(id: string, payload: any) {

  const res = await fetch(`${API}/epr/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload)
  })

  return res.json()
}

export async function getInstructorEprs(id: string) {

  const res = await fetch(`${API}/epr/instructor/${id}`, {
    headers: authHeaders()
  })

  if (!res.ok) {
    throw new Error("Failed to fetch instructor EPRs")
  }

  return res.json()

}