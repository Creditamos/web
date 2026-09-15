import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Client } from "../interfaces/client.interface"

function deleteClient(id: string): Promise<Client> {
  return api.delete<Client>(`/clients/${id}`).then((res) => res.data)
}

export type DeleteClientMutationResult = UseMutationResult<Client, Error, string>

export function useDeleteClient(): DeleteClientMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}
