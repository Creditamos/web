"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { Dialog } from "@/components/Dialog"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  loading?: boolean
  destructive?: boolean
  onConfirm: () => void
  onOpenChange: (open: boolean) => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  loading = false,
  destructive = false,
  onConfirm,
  onOpenChange,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState<boolean>(false)

  const handleConfirm = async () => {
    setPending(true)
    try {
      await onConfirm()
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content showCloseButton className="max-w-md">
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          {description ? <Dialog.Description>{description}</Dialog.Description> : null}
        </Dialog.Header>
        <Dialog.Footer className="px-6 pt-6 pb-6">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant={destructive ? "destructive" : "default"}
            disabled={loading || pending}
            onClick={() => void handleConfirm()}
          >
            {pending ? "Aguarde..." : confirmLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}

export function useConfirmDialog(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen)
  return { open, setOpen }
}
