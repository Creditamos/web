import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Role } from "../interfaces"

function fetchRoles(): Promise<Role[]> {
  return api.get<Role[]>("/roles").then((res) => res.data)
}

export type FetchRolesQueryResult = UseQueryResult<Role[], Error>

export function useRoles(): FetchRolesQueryResult {
  return useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  })
}
