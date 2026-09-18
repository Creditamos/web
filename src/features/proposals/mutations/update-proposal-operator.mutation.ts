import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { CreditProposal } from "../interfaces/credit-proposal.interface"

interface UpdateProposalOperatorVariables {
  id: string
  operator_id: string | null
}

function updateProposalOperator({
  id,
  operator_id,
}: UpdateProposalOperatorVariables): Promise<CreditProposal> {
  return api
    .put<CreditProposal>(`/proposals/${id}/operator`, { operator_id })
    .then((res) => res.data)
}

export type UpdateProposalOperatorMutationResult = UseMutationResult<
  CreditProposal,
  Error,
  UpdateProposalOperatorVariables
>

export function useUpdateProposalOperator(): UpdateProposalOperatorMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProposalOperator,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
  })
}
