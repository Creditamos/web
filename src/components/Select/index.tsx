import { SelectIcon } from "./select-icon"
import { SelectItem } from "./select-item"
import { SelectList } from "./select-list"
import { SelectRoot } from "./select-root"
import { SelectTrigger } from "./select-trigger"
import { SelectValue } from "./select-value"

export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Icon: SelectIcon,
  List: SelectList,
  Item: SelectItem,
})

export { SelectItem }
