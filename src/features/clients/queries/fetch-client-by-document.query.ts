import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Client } from "../interfaces/client.interface"

function fetchClientByDocument(doc: string): Promise<Client> {
  return api.get<Client>(`/clients/document/${doc}`).then((res) => res.data)
}

export type FetchClientByDocumentQueryResult = UseQueryResult<Client, Error>

export function useClientByDocument(doc: string): FetchClientByDocumentQueryResult {
  return useQuery({
    queryKey: ["clients", "document", doc],
    queryFn: () => fetchClientByDocument(doc),
    enabled: !!doc,
  })
}
