export type WhatsappConnectionStatus = "open" | "connecting" | "close"

export interface WhatsappStatus {
  connectionStatus: WhatsappConnectionStatus
  /** Valor bruto do QR code (code) retornado pela Evolution API, usado pelo qrcode.react. */
  qrcode: string | null
}
