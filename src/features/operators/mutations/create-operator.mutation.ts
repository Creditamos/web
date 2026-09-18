import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Operator } from "../interfaces"
import type { OperatorSubmitValues } from "../types"

function createOperator(input: OperatorSubmitValues): Promise<Operator> {
  return api.post<Operator>("/operators", input).then((res) => res.data)
}

export type CreateOperatorMutationResult = UseMutationResult<Operator, Error, OperatorSubmitValues>

export function useCreateOperator(): CreateOperatorMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: createOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] })
    },
  })
}
