import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Scope } from "../interfaces"

/**
 * Catálogo real de scopes (tabela `scopes`), usado no editor de roles.
 * Complementa o mapeamento estático de `lib/scopes.ts` (que espelha o seed).
 */
function fetchScopes(): Promise<Scope[]> {
  return api.get<Scope[]>("/scopes").then((res) => res.data)
}

export type FetchScopesQueryResult = UseQueryResult<Scope[], Error>

export function useScopes(): FetchScopesQueryResult {
  return useQuery({
    queryKey: ["scopes"],
    queryFn: fetchScopes,
  })
}
