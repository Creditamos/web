import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { User } from "../interfaces"
import type { CreateUserInput } from "../types"

function createUser(input: CreateUserInput): Promise<User> {
  return api.post<User>("/users", input).then((res) => res.data)
}

export type CreateUserMutationResult = UseMutationResult<User, Error, CreateUserInput>

export function useCreateUser(): CreateUserMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
