import type { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import type * as React from "react"

import { cn } from "@/lib/utils"
import { DialogBackdrop } from "./dialog-backdrop"
import { DialogClose } from "./dialog-close"
import { DialogPopup } from "./dialog-popup"
import { DialogPortal } from "./dialog-portal"

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup> & { showCloseButton?: boolean }) {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogPopup className={cn("p-0", className)} {...props}>
        {children}
        {showCloseButton && (
          <DialogClose className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <XIcon className="size-4" />
            <span className="sr-only">Fechar</span>
          </DialogClose>
        )}
      </DialogPopup>
    </DialogPortal>
  )
}
