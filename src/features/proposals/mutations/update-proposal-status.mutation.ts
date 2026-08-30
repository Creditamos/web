import { useMutation, useQueryClient, UseMutationResult, QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { CreditProposal } from "../interfaces/credit-proposal.interface";

function updateProposalStatus(
  id: string,
  status: string,
): Promise<CreditProposal> {
  return api
    .put<CreditProposal>(`/proposals/${id}/status`, { status })
    .then((res) => res.data);
}

type UpdateProposalStatusVariables = { id: string; status: string };

export type UpdateProposalStatusMutationResult = UseMutationResult<
  CreditProposal,
  Error,
  UpdateProposalStatusVariables
>;

export function useUpdateProposalStatus(): UpdateProposalStatusMutationResult {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateProposalStatusVariables) =>
      updateProposalStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}
