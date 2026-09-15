import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { User } from "../interfaces"

function fetchUsers(): Promise<User[]> {
  return api.get<User[]>("/users").then((res) => res.data)
}

export type FetchUsersQueryResult = UseQueryResult<User[], Error>

export function useUsers(): FetchUsersQueryResult {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })
}
