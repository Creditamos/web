import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Role } from "../interfaces"
import type { CreateRoleInput } from "../types"

function createRole(input: CreateRoleInput): Promise<Role> {
  return api.post<Role>("/roles", input).then((res) => res.data)
}

export type CreateRoleMutationResult = UseMutationResult<Role, Error, CreateRoleInput>

export function useCreateRole(): CreateRoleMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] })
    },
  })
}
