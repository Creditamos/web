import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Operator } from "../interfaces"
import type { OperatorSubmitValues } from "../types"

interface UpdateOperatorVariables {
  id: string
  input: OperatorSubmitValues & { is_active?: boolean }
}

function updateOperator({ id, input }: UpdateOperatorVariables): Promise<Operator> {
  return api.put<Operator>(`/operators/${id}`, input).then((res) => res.data)
}

export type UpdateOperatorMutationResult = UseMutationResult<
  Operator,
  Error,
  UpdateOperatorVariables
>

export function useUpdateOperator(): UpdateOperatorMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: updateOperator,
    onSuccess: (_operator, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["operators"] })
      queryClient.invalidateQueries({ queryKey: ["operators", id] })
    },
  })
}
