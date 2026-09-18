import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"

function deleteOperator(id: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/operators/${id}`).then((res) => res.data)
}

export type DeleteOperatorMutationResult = UseMutationResult<{ message: string }, Error, string>

export function useDeleteOperator(): DeleteOperatorMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] })
    },
  })
}
