import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { CreditProduct, UpdateProductInput } from "../interfaces/product.interface"

interface UpdateProductParams {
  id: string
  input: UpdateProductInput
}

function updateProduct({ id, input }: UpdateProductParams): Promise<CreditProduct> {
  return api.put<CreditProduct>(`/products/${id}`, input).then((res) => res.data)
}

export type UpdateProductMutationResult = UseMutationResult<
  CreditProduct,
  Error,
  UpdateProductParams
>

export function useUpdateProduct(): UpdateProductMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["products", id] })
    },
  })
}
