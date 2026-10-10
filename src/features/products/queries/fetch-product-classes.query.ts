import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { ProductClass } from "../interfaces/product.interface"

function fetchProductClasses(): Promise<ProductClass[]> {
  return api.get<ProductClass[]>("/products/classes").then((res) => res.data)
}

export type FetchProductClassesQueryResult = UseQueryResult<ProductClass[], Error>

export function useProductClasses(): FetchProductClassesQueryResult {
  return useQuery({
    queryKey: ["product-classes"],
    queryFn: fetchProductClasses,
  })
}
