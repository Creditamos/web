import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Supplier } from "../interfaces"

function fetchSuppliers(): Promise<Supplier[]> {
  return api.get<Supplier[]>("/suppliers").then((res) => res.data)
}

export type FetchSuppliersQueryResult = UseQueryResult<Supplier[], Error>

export function useSuppliers(): FetchSuppliersQueryResult {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: fetchSuppliers,
  })
}
