import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { CreateProductInput, CreditProduct } from "../interfaces/product.interface"

function createProduct(input: CreateProductInput): Promise<CreditProduct> {
  return api.post<CreditProduct>("/products", input).then((res) => res.data)
}

export type CreateProductMutationResult = UseMutationResult<
  CreditProduct,
  Error,
  CreateProductInput
>

export function useCreateProduct(): CreateProductMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
