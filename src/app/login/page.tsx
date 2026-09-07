"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Suspense, type FormEvent, useState } from "react"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Label } from "@/components/Label"
import { ApiError, api } from "@/lib/axios"

function safeNext(raw: string | null): string {
  if (raw?.startsWith("/app") && !raw.startsWith("/app/api")) {
    return raw
  }
  return "/app"
}

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const searchParams = useSearchParams()
  const next = safeNext(searchParams.get("next"))

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await api.post("/auth/login", { email, password })
      window.location.href = next
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? "E-mail ou senha inválidos." : err.message)
      } else {
        setError("Erro inesperado. Tente novamente.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/images/logo.webp"
            alt="Creditamos"
            width={980}
            height={1081}
            className="h-14 w-auto"
            priority
          />
          <h1 className="text-xl font-semibold tracking-tight">Painel</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@creditamos.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
