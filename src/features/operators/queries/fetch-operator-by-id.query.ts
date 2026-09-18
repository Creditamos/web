import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Operator } from "../interfaces"

function fetchOperatorById(id: string): Promise<Operator> {
  return api.get<Operator>(`/operators/${id}`).then((res) => res.data)
}

export type FetchOperatorByIdQueryResult = UseQueryResult<Operator, Error>

export function useOperatorById(id: string): FetchOperatorByIdQueryResult {
  return useQuery({
    queryKey: ["operators", id],
    queryFn: () => fetchOperatorById(id),
    enabled: !!id,
  })
}
