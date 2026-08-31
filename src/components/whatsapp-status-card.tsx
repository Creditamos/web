"use client"

import { RefreshCwIcon } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useEffect } from "react"
import { useWhatsappStatus } from "@/features/whatsapp"

const POLL_INTERVAL_MS = 2000
const MAX_QRCODE_LENGTH = 1024

function isValidQrcode(value: string | null | undefined): value is string {
  if (!value) return false
  if (value.length > MAX_QRCODE_LENGTH) return false
  if (value.startsWith("data:image/")) return false
  if (value.startsWith("iVBOR")) return false
  return true
}

export function WhatsappStatusCard() {
  const { data, isLoading, error, refetch } = useWhatsappStatus()

  useEffect(() => {
    const interval = setInterval(() => {
      void refetch()
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [refetch])

  const connectionStatus = data?.connectionStatus
  const qrcode = isValidQrcode(data?.qrcode) ? data?.qrcode : null

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-secondary">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full ${
              connectionStatus === "open"
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">WhatsApp</h2>
            <p className="text-sm text-muted-foreground">
              Status da conexão e pareamento via QR code
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {connectionStatus === "open" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              <span className="size-1.5 rounded-full bg-success" />
              WhatsApp Conectado 🟢
            </span>
          )}
          {connectionStatus === "connecting" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
              <span className="size-1.5 animate-pulse rounded-full bg-warning" />
              Reconectando...
            </span>
          )}
          {connectionStatus === "close" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
              <span className="size-1.5 rounded-full bg-danger" />
              Desconectado 🔴
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        {isLoading && (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
            Não foi possível conectar à API do WhatsApp. {error.message}
          </div>
        )}

        {!isLoading && !error && connectionStatus === "open" && (
          <div className="flex items-center gap-3 rounded-lg bg-success/5 px-4 py-3 text-sm text-success">
            <span className="size-2 rounded-full bg-success" />
            WhatsApp conectado. Você pode receber e enviar mensagens.
          </div>
        )}

        {!isLoading &&
          !error &&
          (connectionStatus === "close" || connectionStatus === "connecting") && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="size-2 animate-pulse rounded-full bg-warning" />
                {connectionStatus === "connecting"
                  ? "Aguardando conexão — escaneie o QR code abaixo com o WhatsApp."
                  : "Desconectado — um QR code será gerado em instantes."}
              </div>

              {qrcode ? (
                <div className="flex justify-center rounded-lg border border-border bg-white p-4">
                  <QRCodeSVG value={qrcode} size={256} className="h-64 w-64" />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                  <RefreshCwIcon className="mr-2 size-4 animate-spin" />
                  Gerando QR code...
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                Abra o WhatsApp &gt; Aparelhos Conectados &gt; Conectar um aparelho e escaneie o
                código.
              </p>
            </div>
          )}
      </div>
    </div>
  )
}
