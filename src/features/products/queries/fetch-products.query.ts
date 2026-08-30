import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { CreditProduct } from "../interfaces";

function fetchProducts(): Promise<CreditProduct[]> {
  return api.get<CreditProduct[]>("/products").then((res) => res.data);
}

export type FetchProductsQueryResult = UseQueryResult<CreditProduct[], Error>;

export function useProducts(): FetchProductsQueryResult {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}