import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Client } from "../interfaces/client.interface"

export interface SaveClientDocumentsVariables {
  clientId: string
  front?: File | null
  back?: File | null
  onUploadProgress?: (percent: number) => void
}

function saveClientDocuments({
  clientId,
  front,
  back,
  onUploadProgress,
}: SaveClientDocumentsVariables): Promise<Client> {
  const formData = new FormData()
  if (front) formData.append("front", front)
  if (back) formData.append("back", back)

  return api
    .post<Client>(`/clients/${clientId}/kyc-documents`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total) onUploadProgress?.(Math.round((event.loaded / event.total) * 100))
      },
    })
    .then(async (res) => {
      onUploadProgress?.(0)
      return res.data
    })
}

export type SaveClientDocumentsMutationResult = UseMutationResult<
  Client,
  Error,
  SaveClientDocumentsVariables
>

export function useSaveClientDocuments(): SaveClientDocumentsMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: saveClientDocuments,
    onSuccess: (_client, { clientId }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      queryClient.invalidateQueries({ queryKey: ["clients", clientId] })
    },
  })
}
