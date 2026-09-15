import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Client } from "../interfaces/client.interface"
import type { UpdateClientInput } from "../types"

function updateClient({ id, input }: { id: string; input: UpdateClientInput }): Promise<Client> {
  return api.put<Client>(`/clients/${id}`, input).then((res) => res.data)
}

export type UpdateClientMutationResult = UseMutationResult<
  Client,
  Error,
  { id: string; input: UpdateClientInput }
>

export function useUpdateClient(): UpdateClientMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: updateClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
    },
  })
}
