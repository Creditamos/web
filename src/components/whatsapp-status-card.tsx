"use client"

import { RefreshCwIcon } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { Skeleton } from "@/components/skeleton"
import { StatusBadge } from "@/components/status-badge"
import { useWhatsappStatus } from "@/features/whatsapp"

const MAX_QRCODE_LENGTH = 1024

function isValidQrcode(value: string | null | undefined): value is string {
  if (!value) return false
  if (value.length > MAX_QRCODE_LENGTH) return false
  if (value.startsWith("data:image/")) return false
  if (value.startsWith("iVBOR")) return false
  return true
}

export function WhatsappStatusCard() {
  const { data, isLoading, error } = useWhatsappStatus()

  const connectionStatus = data?.connectionStatus
  const qrcode = isValidQrcode(data?.qrcode) ? data?.qrcode : null

  return (
    <section className="rounded-lg border border-border bg-card shadow-xs">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
        <div className="flex items-baseline gap-2">
          <h2 className="text-sm font-medium text-foreground">WhatsApp</h2>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Canal de envio de mensagens aos clientes
          </p>
        </div>
        {isLoading ? (
          <Skeleton className="h-4 w-28" />
        ) : connectionStatus === "open" ? (
          <StatusBadge tone="success">Conectado</StatusBadge>
        ) : connectionStatus === "connecting" ? (
          <StatusBadge tone="warning">Reconectando</StatusBadge>
        ) : connectionStatus === "close" ? (
          <StatusBadge tone="danger">Desconectado</StatusBadge>
        ) : (
          <StatusBadge tone="muted">Indisponível</StatusBadge>
        )}
      </div>

      <div className="px-4 py-3.5">
        {error ? (
          <p className="text-sm text-destructive">
            Não foi possível conectar à API do WhatsApp. {error.message}
          </p>
        ) : isLoading ? (
          <Skeleton className="h-4 w-64 max-w-full" />
        ) : connectionStatus === "open" ? (
          <p className="text-sm text-muted-foreground">
            Sessão ativa — é possível enviar e receber mensagens.
          </p>
        ) : connectionStatus === "connecting" || connectionStatus === "close" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {connectionStatus === "connecting"
                ? "Aguardando conexão — escaneie o QR code abaixo com o WhatsApp."
                : "Sessão encerrada — um novo QR code será gerado em instantes."}
            </p>
            {qrcode ? (
              <div className="flex justify-center rounded-md border border-border bg-white p-4">
                <QRCodeSVG value={qrcode} size={200} className="h-48 w-48" />
              </div>
            ) : (
              <div className="flex h-44 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                <RefreshCwIcon className="mr-2 size-4 animate-spin" />
                Gerando QR code...
              </div>
            )}
            <p className="text-center text-xs text-muted-foreground">
              Abra o WhatsApp &gt; Aparelhos Conectados &gt; Conectar um aparelho e escaneie o
              código.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Status da conexão indisponível.</p>
        )}
      </div>
    </section>
  )
}
