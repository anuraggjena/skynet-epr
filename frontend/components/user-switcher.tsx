"use client"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

import { getUsers, getSession, setSession } from "@/lib/session"

export default function UserSwitcher() {

  const users = getUsers()
  const session = getSession()

  function handleChange(value: string) {

    const user = users.find(u => u.id === value)

    if (user) {
      setSession(user)
      window.location.reload()
    }
  }

  return (

    <Select defaultValue={session.id} onValueChange={handleChange}>

      <SelectTrigger className="w-50">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>

        {users.map(user => (

          <SelectItem key={user.id} value={user.id}>
            {user.name} ({user.role})
          </SelectItem>

        ))}

      </SelectContent>

    </Select>

  )
}