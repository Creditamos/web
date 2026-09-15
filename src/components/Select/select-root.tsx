"use client"

import { Select as SelectPrimitive } from "@base-ui/react/select"

function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: SelectPrimitive.Root.Props<Value, Multiple>,
) {
  return <SelectPrimitive.Root {...props} />
}

export { SelectRoot }
