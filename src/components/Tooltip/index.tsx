import { TooltipContent } from "./tooltip-content"
import { TooltipProvider } from "./tooltip-provider"
import { TooltipRoot } from "./tooltip-root"
import { TooltipTrigger } from "./tooltip-trigger"

export const Tooltip = Object.assign(TooltipRoot, {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Provider: TooltipProvider,
})
