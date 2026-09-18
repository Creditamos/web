import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"

function reactivateOperator(id: string): Promise<{ message: string }> {
  return api.put<{ message: string }>(`/operators/${id}/reactivate`).then((res) => res.data)
}

export type ReactivateOperatorMutationResult = UseMutationResult<{ message: string }, Error, string>

export function useReactivateOperator(): ReactivateOperatorMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: reactivateOperator,
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: ["operators"] })
      queryClient.invalidateQueries({ queryKey: ["operators", id] })
    },
  })
}
