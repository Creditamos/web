import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { SupplierClass } from "../interfaces"

/**
 * Classes e subclasses de fornecedores ativas — usadas nos formulários
 * de criação/edição de fornecedores (relação `class → subclasses`).
 */
function fetchSupplierClasses(): Promise<SupplierClass[]> {
  return api.get<SupplierClass[]>("/suppliers/classes").then((res) => res.data)
}

export type FetchSupplierClassesQueryResult = UseQueryResult<SupplierClass[], Error>

export function useSupplierClasses(): FetchSupplierClassesQueryResult {
  return useQuery({
    queryKey: ["suppliers", "classes"],
    queryFn: fetchSupplierClasses,
  })
}
