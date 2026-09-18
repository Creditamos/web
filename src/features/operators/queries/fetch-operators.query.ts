import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Operator } from "../interfaces"

function fetchOperators(active?: boolean): Promise<Operator[]> {
  const query: string = active === undefined ? "" : `?active=${active}`
  return api.get<Operator[]>(`/operators${query}`).then((res) => res.data)
}

export type FetchOperatorsQueryResult = UseQueryResult<Operator[], Error>

export function useOperators(active?: boolean): FetchOperatorsQueryResult {
  return useQuery({
    queryKey: ["operators", active === undefined ? "all" : active],
    queryFn: () => fetchOperators(active),
  })
}
