import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Operator } from "../interfaces"

function fetchOperators(): Promise<Operator[]> {
  return api.get<Operator[]>("/operators").then((res) => res.data)
}

export type FetchOperatorsQueryResult = UseQueryResult<Operator[], Error>

export function useOperators(): FetchOperatorsQueryResult {
  return useQuery({
    queryKey: ["operators"],
    queryFn: fetchOperators,
  })
}
