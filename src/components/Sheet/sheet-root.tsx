"use client"

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

function SheetRoot({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

export { SheetRoot }
