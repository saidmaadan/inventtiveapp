import NextAuth from "next-auth"
import type { NextAuthConfig } from "next-auth"
import { authOptions } from "./lib/auth"

export type { Session } from "next-auth"

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions as NextAuthConfig)

export { authOptions }
