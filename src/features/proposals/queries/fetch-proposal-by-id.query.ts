import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { CreditProposal } from "../interfaces/credit-proposal.interface"

function fetchProposalById(id: string): Promise<CreditProposal> {
  return api.get<CreditProposal>(`/proposals/${id}`).then((res) => res.data)
}

export type FetchProposalByIdQueryResult = UseQueryResult<CreditProposal, Error>

export function useProposal(id: string): FetchProposalByIdQueryResult {
  return useQuery({
    queryKey: ["proposals", id],
    queryFn: () => fetchProposalById(id),
    enabled: !!id,
  })
}
