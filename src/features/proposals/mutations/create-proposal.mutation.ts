import { useMutation, useQueryClient, UseMutationResult, QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { CreditProposal } from "../interfaces/credit-proposal.interface";
import type { CreateProposalInput } from "../types";

function createProposal(input: CreateProposalInput): Promise<CreditProposal> {
  return api.post<CreditProposal>("/proposals", input).then((res) => res.data);
}

export type CreateProposalMutationResult = UseMutationResult<CreditProposal, Error, CreateProposalInput>;

export function useCreateProposal(): CreateProposalMutationResult {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
}
