import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"

function deleteUser(id: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/users/${id}`).then((res) => res.data)
}

export type DeleteUserMutationResult = UseMutationResult<{ message: string }, Error, string>

export function useDeleteUser(): DeleteUserMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
