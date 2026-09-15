import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { CreditProduct } from "../interfaces"

/**
 * O backend retorna `null` (200 com corpo vazio) quando o produto não existe,
 * em vez de 404 — comportamento distinto dos demais endpoints.
 */
function fetchProductById(id: string): Promise<CreditProduct | null> {
  return api.get<CreditProduct>(`/products/${id}`).then((res) => res.data)
}

export type FetchProductByIdQueryResult = UseQueryResult<CreditProduct | null, Error>

export function useProductById(id: string): FetchProductByIdQueryResult {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(id),
    enabled: !!id,
  })
}
