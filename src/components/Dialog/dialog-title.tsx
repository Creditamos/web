import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import type * as React from "react"

import { cn } from "@/lib/utils"

export function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}
