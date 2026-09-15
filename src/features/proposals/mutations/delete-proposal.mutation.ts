import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"

function deleteProposal(id: string): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/proposals/${id}`).then((res) => res.data)
}

export type DeleteProposalMutationResult = UseMutationResult<{ message: string }, Error, string>

export function useDeleteProposal(): DeleteProposalMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
  })
}
