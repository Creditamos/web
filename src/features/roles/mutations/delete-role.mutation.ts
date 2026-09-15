import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"

function deleteRole(id: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/roles/${id}`).then((res) => res.data)
}

export type DeleteRoleMutationResult = UseMutationResult<{ message: string }, Error, string>

export function useDeleteRole(): DeleteRoleMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
