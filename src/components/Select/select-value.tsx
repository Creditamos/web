"use client"

import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "cn"

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("truncate", className)}
      {...props}
    />
  )
}

export { SelectValue }
