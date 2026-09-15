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
  if (raw?.startsWith("/") && !raw.startsWith("/api")) {
    return raw
  }
  return "/"
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
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/images/logo.webp"
            alt="Creditamos"
            width={980}
            height={1081}
            className="h-12 w-auto"
            priority
          />
          <div className="text-center">
            <h1 className="text-lg font-semibold tracking-tight">Painel administrativo</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Acesse sua conta para continuar.</p>
          </div>
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
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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
            <p
              className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
              role="alert"
            >
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
