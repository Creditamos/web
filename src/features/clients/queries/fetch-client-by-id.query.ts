import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Client } from "../interfaces/client.interface"

function fetchClientById(id: string): Promise<Client> {
  return api.get<Client>(`/clients/${id}`).then((res) => res.data)
}

export type FetchClientByIdQueryResult = UseQueryResult<Client, Error>

export function useClient(id: string): FetchClientByIdQueryResult {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => fetchClientById(id),
    enabled: !!id,
  })
}
