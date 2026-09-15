import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"

function deleteSupplier(id: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/suppliers/${id}`).then((res) => res.data)
}

export type DeleteSupplierMutationResult = UseMutationResult<{ message: string }, Error, string>

export function useDeleteSupplier(): DeleteSupplierMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
