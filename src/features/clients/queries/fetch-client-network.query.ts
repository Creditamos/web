import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { ClientNetwork } from "../interfaces/client-network.interface";

function fetchClientNetwork(): Promise<ClientNetwork[]> {
  return api.get<ClientNetwork[]>("/clients/network").then((res) => res.data);
}

export type FetchClientNetworkQueryResult = UseQueryResult<ClientNetwork[], Error>;

export function useClientNetwork(): FetchClientNetworkQueryResult {
  return useQuery({
    queryKey: ["clients", "network"],
    queryFn: fetchClientNetwork,
  });
}
