"use client"

import { useForm } from "@tanstack/react-form"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { Suspense, useState } from "react"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { ApiError, api } from "@/lib/axios"
import { loginSchema } from "@/schemas/auth.schema"

function safeNext(raw: string | null): string {
  if (raw?.startsWith("/app") && !raw.startsWith("/app/api")) {
    return raw
  }
  return "/app"
}

function LoginForm() {
  const [error, setError] = useState("")
  const searchParams = useSearchParams()
  const next = safeNext(searchParams.get("next"))

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setError("")

      try {
        await api.post("/auth/login", { email: value.email, password: value.password })
        window.location.href = next
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.status === 401 ? "E-mail ou senha inválidos." : err.message)
        } else {
          setError("Erro inesperado. Tente novamente.")
        }
      }
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/app/images/logo.webp"
            alt="Creditamos"
            width={980}
            height={1081}
            className="h-14 w-auto"
            priority
          />
          <h1 className="text-xl font-semibold tracking-tight">Painel</h1>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
          noValidate
        >
          <form.Field
            name="email"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="admin@creditamos.com"
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.map((fieldError) =>
                  fieldError ? (
                    <p className="text-sm text-destructive" key={fieldError.message}>
                      {fieldError.message}
                    </p>
                  ) : null,
                )}
              </div>
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  aria-invalid={field.state.meta.errors.length > 0}
                />
                {field.state.meta.errors.map((fieldError) =>
                  fieldError ? (
                    <p className="text-sm text-destructive" key={fieldError.message}>
                      {fieldError.message}
                    </p>
                  ) : null,
                )}
              </div>
            )}
          />

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            )}
          />
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
