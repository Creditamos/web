"use client"

import { type ReactNode, useMemo } from "react"
import { useAuth } from "@/providers/auth.provider"

/**
 * Catálogo de scopes espelhado no seeder `02-scopes.seeder.ts` do backend.
 * O formato é `{recurso}:{ação}` — ex.: `clients:read`.
 *
 * API GAP: a API atual não expõe os scopes do usuário em lugar nenhum
 * (nem no login, nem em `/auth/me` — apenas `roleNames`). Enquanto isso,
 * o mapeamento role → scopes abaixo é a fonte de autorização da UI.
 * Assim que o backend expuser `scopes` no `UserPublicProfile`, este módulo
 * precisa apenas passar a ler de lá (a UI continua 100% baseada em scopes).
 */
export const SCOPE_CATALOG = {
  clients: ["read", "create", "update", "delete"],
  proposals: ["read", "create", "update", "approve", "reject"],
  suppliers: ["read", "create", "update", "delete"],
  operators: ["read", "create", "update", "delete"],
  products: ["read", "create", "update", "delete"],
  users: ["read", "create", "update", "delete"],
  roles: ["read", "create", "update", "delete"],
  organizations: ["read", "create", "update", "delete"],
} as const

export type ScopeResource = keyof typeof SCOPE_CATALOG
export type ScopeAction = (typeof SCOPE_CATALOG)[ScopeResource][number]
export type Scope = `${ScopeResource}:${ScopeAction}`

const ALL_SCOPES: Scope[] = Object.entries(SCOPE_CATALOG).flatMap(([resource, actions]) =>
  actions.map((action) => `${resource}:${action}` as Scope),
)

/**
 * Scopes concedidos por role. Espelha `role-scopes.seeder.ts`: no seed atual
 * SUPER_ADMIN e ADMIN recebem todos os scopes. Refinar roles deve acontecer
 * alinhado ao backend (quando o RBAC for enforceado) — a UI apenas consome.
 */
const ROLE_SCOPES: Record<string, Scope[]> = {
  SUPER_ADMIN: ALL_SCOPES,
  ADMIN: ALL_SCOPES,
}

export function scopesForRoles(roleNames: string[]): Scope[] {
  const scopes = new Set<Scope>()
  for (const role of roleNames) {
    const granted = ROLE_SCOPES[role] ?? []
    for (const scope of granted) scopes.add(scope)
  }
  return [...scopes]
}

export function hasScope(scopes: readonly string[], scope: Scope): boolean {
  return scopes.includes(scope)
}

export function useUserScopes(): Scope[] {
  const { admin } = useAuth()
  return useMemo(() => scopesForRoles(admin?.roleNames ?? []), [admin])
}

export function useHasScope(): (scope: Scope) => boolean {
  const scopes = useUserScopes()
  return (scope: Scope) => hasScope(scopes, scope)
}

interface CanProps {
  scope: Scope
  children: ReactNode
  fallback?: ReactNode
}

export function Can({ scope, children, fallback = null }: CanProps): ReactNode {
  const has = useHasScope()
  return has(scope) ? children : fallback
}
