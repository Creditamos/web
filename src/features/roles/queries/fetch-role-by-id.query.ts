import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Role } from "../interfaces"

function fetchRoleById(id: string): Promise<Role> {
  return api.get<Role>(`/roles/${id}`).then((res) => res.data)
}

export type FetchRoleByIdQueryResult = UseQueryResult<Role, Error>

export function useRoleById(id: string): FetchRoleByIdQueryResult {
  return useQuery({
    queryKey: ["roles", id],
    queryFn: () => fetchRoleById(id),
    enabled: !!id,
  })
}
