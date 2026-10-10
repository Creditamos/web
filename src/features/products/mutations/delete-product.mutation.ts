import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"

function deleteProduct(id: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/products/${id}`).then((res) => res.data)
}

export type DeleteProductMutationResult = UseMutationResult<{ message: string }, Error, string>

export function useDeleteProduct(): DeleteProductMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
