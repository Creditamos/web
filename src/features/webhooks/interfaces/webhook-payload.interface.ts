export interface WebhookPayload {
  event: string;
  document_number?: string;
  data?: Record<string, unknown>;
}
