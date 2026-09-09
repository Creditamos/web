import { SheetClose } from "./sheet-close"
import { SheetContent } from "./sheet-content"
import { SheetDescription } from "./sheet-description"
import { SheetFooter } from "./sheet-footer"
import { SheetHeader } from "./sheet-header"
import { SheetOverlay } from "./sheet-overlay"
import { SheetPortal } from "./sheet-portal"
import { SheetRoot } from "./sheet-root"
import { SheetTitle } from "./sheet-title"
import { SheetTrigger } from "./sheet-trigger"

export const Sheet = Object.assign(SheetRoot, {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Close: SheetClose,
  Portal: SheetPortal,
  Overlay: SheetOverlay,
  Content: SheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription,
})
