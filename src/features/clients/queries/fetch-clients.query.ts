import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Client } from "../interfaces/client.interface";

function fetchClients(): Promise<Client[]> {
  return api.get<Client[]>("/clients").then((res) => res.data);
}

export type FetchClientsQueryResult = UseQueryResult<Client[], Error>;

export function useClients(): FetchClientsQueryResult {
  return useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });
}
