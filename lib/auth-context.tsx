"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"

export interface User {
  id: string
  email: string
  name: string
  role: "customer" | "admin"
  createdAt: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<{
  state: AuthState
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => Promise<void>
} | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.full_name,
            role: profile.role,
            createdAt: profile.created_at,
          }
          setState({ user, isLoading: false, isAuthenticated: true })
        } else {
          setState({ user: null, isLoading: false, isAuthenticated: false })
        }
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false })
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (profile) {
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: profile.full_name,
            role: profile.role,
            createdAt: profile.created_at,
          }
          setState({ user, isLoading: false, isAuthenticated: true })
        }
      } else if (event === "SIGNED_OUT") {
        setState({ user: null, isLoading: false, isAuthenticated: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const login = async (email: string, password: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }))

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Login error:", error)
      setState((prev) => ({ ...prev, isLoading: false }))
      return false
    }

    setState((prev) => ({ ...prev, isLoading: false, isAuthenticated: true }))
    return true
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true }))

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/verify-email`,
        data: {
          full_name: name,
          role: "customer",
        },
      },
    })

    if (error) {
      console.error("Registration error:", error)
      setState((prev) => ({ ...prev, isLoading: false }))
      return false
    }

    setState((prev) => ({ ...prev, isLoading: false }))
    return true
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return <AuthContext.Provider value={{ state, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
