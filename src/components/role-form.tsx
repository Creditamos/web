"use client"

import { cn } from "cn"
import { CheckIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/button"
import { ErrorNote } from "@/components/error-note"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/input"
import type { Scope } from "@/features/roles"
import { useScopes } from "@/features/roles"

export interface RoleFormInitialValues {
  name?: string
  description?: string | null
  scope_ids?: string[]
}

export interface RoleSubmitValues {
  name: string
  description?: string
  scope_ids?: string[]
}

interface RoleFormProps {
  initialValues?: RoleFormInitialValues
  submitLabel: string
  submitting?: boolean
  error?: string | null
  /** Bloqueia a edição de scopes (roles protegidas, ex.: SUPER_ADMIN). */
  scopesLocked?: boolean
  onSubmit: (values: RoleSubmitValues) => Promise<void> | void
}

function resourceOf(scopeName: string): string {
  const index = scopeName.indexOf(":")
  return index === -1 ? scopeName : scopeName.slice(0, index)
}

export function RoleForm({
  initialValues,
  submitLabel,
  submitting = false,
  error = null,
  scopesLocked = false,
  onSubmit,
}: RoleFormProps) {
  const { data: scopes } = useScopes()

  const [name, setName] = useState(initialValues?.name ?? "")
  const [description, setDescription] = useState(initialValues?.description ?? "")
  const [selectedScopeIds, setSelectedScopeIds] = useState<string[]>(initialValues?.scope_ids ?? [])

  const groupedScopes = useMemo(() => {
    const groups = new Map<string, Scope[]>()
    for (const scope of scopes ?? []) {
      const resource = resourceOf(scope.name)
      const current = groups.get(resource) ?? []
      current.push(scope)
      groups.set(resource, current)
    }
    return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [scopes])

  const toggleScope = (scopeId: string) => {
    setSelectedScopeIds((prev) =>
      prev.includes(scopeId) ? prev.filter((id) => id !== scopeId) : [...prev, scopeId],
    )
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    void onSubmit({
      name,
      ...(description.trim() ? { description: description.trim() } : {}),
      scope_ids: selectedScopeIds,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Identificação</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="role-name" label="Nome">
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
              disabled={scopesLocked}
              placeholder="ex.: SUPPORT"
              className="font-mono"
            />
          </FormField>

          <FormField htmlFor="role-description" label="Descrição" optional>
            <Input
              id="role-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={255}
              placeholder="Suporte ao painel administrativo"
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Permissões</h2>
          <p className="text-xs text-muted-foreground">
            Cada permissão segue o formato <span className="font-mono">recurso:ação</span>. Usuários
            com esta role herdam todos os scopes selecionados.
          </p>
        </div>

        {groupedScopes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma permissão disponível.</p>
        ) : (
          <div className="space-y-5">
            {groupedScopes.map(([resource, resourceScopes]) => (
              <div key={resource} className="space-y-2">
                <h3 className="font-mono text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {resource}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {resourceScopes.map((scope) => {
                    const selected = selectedScopeIds.includes(scope.id)
                    const action = scope.name.slice(scope.name.indexOf(":") + 1)
                    return (
                      <button
                        key={scope.id}
                        type="button"
                        disabled={scopesLocked}
                        aria-pressed={selected}
                        onClick={() => toggleScope(scope.id)}
                        title={scope.description ?? undefined}
                        className={cn(
                          "inline-flex h-7 items-center gap-1 rounded-md border px-2.5 font-mono text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
                          selected
                            ? "border-border bg-muted text-foreground"
                            : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        )}
                      >
                        {selected ? <CheckIcon className="size-3 text-success" /> : null}
                        {action}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {scopesLocked ? (
        <p className="rounded-md border border-warning/25 bg-warning/5 px-3 py-2.5 text-sm text-warning">
          Role protegida: nome e permissões não podem ser alterados para não comprometer o acesso
          administrativo.
        </p>
      ) : null}

      {error ? <ErrorNote className="m-0">{error}</ErrorNote> : null}

      <div className="flex items-center justify-end border-t border-border pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
