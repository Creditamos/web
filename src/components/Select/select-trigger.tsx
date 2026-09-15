"use client"

import { Select as SelectPrimitive } from "@base-ui/react/select"
import { ChevronDownIcon } from "lucide-react"

function SelectTrigger({ className, children, ...props }: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className="inline-flex h-8 shrink-0 items-center justify-between gap-1 rounded-md border border-border bg-background px-2.5 text-sm font-medium whitespace-nowrap text-foreground shadow-xs transition-colors outline-none select-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:bg-muted data-[popup-open]:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
    </SelectPrimitive.Trigger>
  )
}

export { SelectTrigger }
