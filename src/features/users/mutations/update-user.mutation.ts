import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { User } from "../interfaces"
import type { UpdateUserInput } from "../types"

interface UpdateUserVariables {
  id: string
  input: UpdateUserInput
}

function updateUser({ id, input }: UpdateUserVariables): Promise<User> {
  return api.put<User>(`/users/${id}`, input).then((res) => res.data)
}

export type UpdateUserMutationResult = UseMutationResult<User, Error, UpdateUserVariables>

export function useUpdateUser(): UpdateUserMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: updateUser,
    onSuccess: (_user, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      queryClient.invalidateQueries({ queryKey: ["users", id] })
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
  })
}
