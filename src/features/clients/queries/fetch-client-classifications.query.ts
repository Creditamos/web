import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { ClientClassifications } from "../interfaces/client-classification.interface"

function fetchClientClassifications(): Promise<ClientClassifications> {
  return api.get<ClientClassifications>("/clients/classifications").then((res) => res.data)
}

export type FetchClientClassificationsQueryResult = UseQueryResult<ClientClassifications, Error>

export function useClientClassifications(): FetchClientClassificationsQueryResult {
  return useQuery({
    queryKey: ["clients", "classifications"],
    queryFn: fetchClientClassifications,
    staleTime: Infinity,
  })
}
