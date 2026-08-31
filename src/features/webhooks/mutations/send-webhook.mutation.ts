import { type UseMutationResult, useMutation } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { WebhookPayload } from "../interfaces/webhook-payload.interface"
import type { WebhookResponse } from "../interfaces/webhook-response.interface"

function sendWebhook(payload: WebhookPayload): Promise<WebhookResponse> {
  return api.post<WebhookResponse>("/webhooks", payload).then((res) => res.data)
}

export type SendWebhookMutationResult = UseMutationResult<WebhookResponse, Error, WebhookPayload>

export function useSendWebhook(): SendWebhookMutationResult {
  return useMutation({
    mutationFn: sendWebhook,
  })
}
