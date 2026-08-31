import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import type * as React from "react"

import { cn } from "@/lib/utils"

export function DialogClose({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close className={cn(className)} {...props} />
}
