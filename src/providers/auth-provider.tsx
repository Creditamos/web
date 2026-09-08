"use client"

import { createContext, type JSX, useCallback, useContext, useEffect, useState } from "react"
import { api } from "@/lib/axios"

export interface AdminInfo {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextValue {
  admin: AdminInfo | null
  loading: boolean
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [admin, setAdmin] = useState<AdminInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await api.get<AdminInfo>("/auth/me")
      setAdmin(data)
    } catch {
      setAdmin(null)
    }
  }, [])

  useEffect(() => {
    fetchMe().finally(() => setLoading(false))
  }, [fetchMe])

  const logout = useCallback(async () => {
    await api.post("/auth/logout").catch(() => {})
    setAdmin(null)
    window.location.href = "/login"
  }, [])

  const refresh = useCallback(async () => {
    await fetchMe()
  }, [fetchMe])

  return (
    <AuthContext.Provider value={{ admin, loading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
