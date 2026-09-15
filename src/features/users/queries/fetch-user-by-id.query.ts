import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { User } from "../interfaces"

function fetchUserById(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`).then((res) => res.data)
}

export type FetchUserByIdQueryResult = UseQueryResult<User, Error>

export function useUserById(id: string): FetchUserByIdQueryResult {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
  })
}
