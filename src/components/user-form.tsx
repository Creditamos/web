"use client"

import { cn } from "cn"
import { CheckIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/button"
import { ErrorNote } from "@/components/error-note"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/input"
import { useRoles } from "@/features/roles"

export interface UserFormInitialValues {
  name?: string
  email?: string
  role_ids?: string[]
}

export interface UserSubmitValues {
  name: string
  email: string
  password?: string
  role_ids?: string[]
}

interface UserFormProps {
  initialValues?: UserFormInitialValues
  submitLabel: string
  submitting?: boolean
  error?: string | null
  /** Exige senha (criação) ou a torna opcional (edição). */
  passwordRequired?: boolean
  /** Bloqueia a edição de roles (ex.: não é permitido alterar as próprias roles). */
  rolesLocked?: boolean
  onSubmit: (values: UserSubmitValues) => Promise<void> | void
}

export function UserForm({
  initialValues,
  submitLabel,
  submitting = false,
  error = null,
  passwordRequired = false,
  rolesLocked = false,
  onSubmit,
}: UserFormProps) {
  const { data: roles } = useRoles()

  const [name, setName] = useState(initialValues?.name ?? "")
  const [email, setEmail] = useState(initialValues?.email ?? "")
  const [password, setPassword] = useState("")
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(initialValues?.role_ids ?? [])

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId],
    )
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    void onSubmit({
      name,
      email,
      ...(password ? { password } : {}),
      role_ids: selectedRoleIds,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Identificação</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="user-name" label="Nome">
            <Input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={255}
              placeholder="Nome completo"
            />
          </FormField>

          <FormField htmlFor="user-email" label="E-mail">
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="usuario@creditamos.com"
            />
          </FormField>

          <FormField
            htmlFor="user-password"
            label={passwordRequired ? "Senha" : "Nova senha"}
            optional={!passwordRequired}
            hint={passwordRequired ? "Mínimo de 8 caracteres." : undefined}
          >
            <Input
              id="user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={passwordRequired}
              minLength={8}
              placeholder={passwordRequired ? "••••••••" : "●●●●●●●●"}
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Perfis de acesso</h2>
          <p className="text-xs text-muted-foreground">
            As permissões do usuário são a soma dos scopes de cada role selecionada.
          </p>
        </div>
        {roles && roles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => {
              const selected = selectedRoleIds.includes(role.id)
              return (
                <button
                  key={role.id}
                  type="button"
                  disabled={rolesLocked || !role.isActive}
                  aria-pressed={selected}
                  onClick={() => toggleRole(role.id)}
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-md border px-3 font-mono text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
                    selected
                      ? "border-border bg-muted text-foreground"
                      : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {selected ? <CheckIcon className="size-3.5 text-success" /> : null}
                  {role.name}
                  {!role.isActive ? <span className="opacity-70">(inativo)</span> : null}
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhuma role disponível.</p>
        )}
      </section>

      {error ? <ErrorNote className="m-0">{error}</ErrorNote> : null}

      <div className="flex items-center justify-end border-t border-border pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
