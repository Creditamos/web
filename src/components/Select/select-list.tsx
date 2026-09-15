"use client"

import { Select as SelectPrimitive } from "@base-ui/react/select"
import { cn } from "cn"

function SelectList({ className, ...props }: SelectPrimitive.List.Props) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner className="isolate z-50">
        <SelectPrimitive.Popup
          data-slot="select-popup"
          className={cn(
            "z-50 max-h-[--anchor-popup-available-height] min-w-[--anchor-width] overflow-y-auto rounded-lg bg-background p-1 text-foreground shadow-lg ring-1 ring-border data-open:animate-in data-open:fade-in-0 data-open:zoom-in-96 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-96",
            className,
          )}
          {...props}
        />
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

export { SelectList }
