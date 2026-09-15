import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Role } from "../interfaces"
import type { UpdateRoleInput } from "../types"

interface UpdateRoleVariables {
  id: string
  input: UpdateRoleInput
}

function updateRole({ id, input }: UpdateRoleVariables): Promise<Role> {
  return api.put<Role>(`/roles/${id}`, input).then((res) => res.data)
}

export type UpdateRoleMutationResult = UseMutationResult<Role, Error, UpdateRoleVariables>

export function useUpdateRole(): UpdateRoleMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: updateRole,
    onSuccess: (_role, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      queryClient.invalidateQueries({ queryKey: ["roles", id] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
