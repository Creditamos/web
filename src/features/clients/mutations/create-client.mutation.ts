import { useMutation, useQueryClient, UseMutationResult, QueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Client } from "../interfaces/client.interface";
import type { CreateClientInput } from "../types";

function createClient(input: CreateClientInput): Promise<Client> {
  return api.post<Client>("/clients", input).then((res) => res.data);
}

export type CreateClientMutationResult = UseMutationResult<Client, Error, CreateClientInput>;

export function useCreateClient(): CreateClientMutationResult {
  const queryClient: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
