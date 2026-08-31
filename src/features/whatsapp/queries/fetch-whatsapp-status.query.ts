import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { WhatsappStatus } from "../interfaces"

function fetchWhatsappStatus(): Promise<WhatsappStatus> {
  return api.get<WhatsappStatus>("/whatsapp/status").then((res) => res.data)
}

export type FetchWhatsappStatusQueryResult = UseQueryResult<WhatsappStatus, Error>

export function useWhatsappStatus(): FetchWhatsappStatusQueryResult {
  return useQuery({
    queryKey: ["whatsapp", "status"],
    queryFn: fetchWhatsappStatus,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  })
}
