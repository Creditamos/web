"use client"

import { Select as SelectPrimitive } from "@base-ui/react/select"

function SelectIcon({ className, ...props }: SelectPrimitive.Icon.Props) {
  return <SelectPrimitive.Icon data-slot="select-icon" className={className} {...props} />
}

export { SelectIcon }
