import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { CreditProposal } from "../interfaces/credit-proposal.interface";

function fetchProposals(): Promise<CreditProposal[]> {
  return api.get<CreditProposal[]>("/proposals").then((res) => res.data);
}

function fetchProposalsByStatus(status: string): Promise<CreditProposal[]> {
  return api
    .get<CreditProposal[]>(`/proposals/status/${status}`)
    .then((res) => res.data);
}

export type FetchProposalsQueryResult = UseQueryResult<CreditProposal[], Error>;

export function useProposals(status?: string): FetchProposalsQueryResult {
  return useQuery({
    queryKey: ["proposals", { status }],
    queryFn: () => (status ? fetchProposalsByStatus(status) : fetchProposals()),
  });
}
