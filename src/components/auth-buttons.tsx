"use client"

import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignInButton() {
  return (
    <Button
      variant="default"
      onClick={() => signIn()}
      className="relative"
    >
      Sign In
    </Button>
  )
}

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      onClick={() => signOut()}
      className="w-full justify-start"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  )
}
