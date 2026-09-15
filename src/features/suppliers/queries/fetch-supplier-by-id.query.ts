import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Supplier } from "../interfaces"

function fetchSupplierById(id: string): Promise<Supplier> {
  return api.get<Supplier>(`/suppliers/${id}`).then((res) => res.data)
}

export type FetchSupplierByIdQueryResult = UseQueryResult<Supplier, Error>

export function useSupplierById(id: string): FetchSupplierByIdQueryResult {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: () => fetchSupplierById(id),
    enabled: !!id,
  })
}
