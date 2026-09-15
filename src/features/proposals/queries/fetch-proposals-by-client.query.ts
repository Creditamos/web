import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { CreditProposal } from "../interfaces/credit-proposal.interface"

function fetchProposalsByClient(clientId: string): Promise<CreditProposal[]> {
  return api.get<CreditProposal[]>(`/proposals/client/${clientId}`).then((res) => res.data)
}

export type FetchClientProposalsQueryResult = UseQueryResult<CreditProposal[], Error>

export function useClientProposals(clientId: string): FetchClientProposalsQueryResult {
  return useQuery({
    queryKey: ["proposals", { client: clientId }],
    queryFn: () => fetchProposalsByClient(clientId),
    enabled: !!clientId,
  })
}
