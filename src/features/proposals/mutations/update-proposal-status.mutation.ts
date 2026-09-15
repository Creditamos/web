import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { CreditProposal, ProposalStatusEnum } from "../interfaces/credit-proposal.interface"

function updateProposalStatus(id: string, status: ProposalStatusEnum): Promise<CreditProposal> {
  return api.put<CreditProposal>(`/proposals/${id}/status`, { status }).then((res) => res.data)
}

export type UpdateProposalStatusVariables = { id: string; status: ProposalStatusEnum }

export type UpdateProposalStatusMutationResult = UseMutationResult<
  CreditProposal,
  Error,
  UpdateProposalStatusVariables
>

export function useUpdateProposalStatus(): UpdateProposalStatusMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: UpdateProposalStatusVariables) => updateProposalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
  })
}
