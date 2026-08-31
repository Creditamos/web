import { DialogBackdrop } from "./dialog-backdrop"
import { DialogClose } from "./dialog-close"
import { DialogContent } from "./dialog-content"
import { DialogDescription } from "./dialog-description"
import { DialogFooter } from "./dialog-footer"
import { DialogHeader } from "./dialog-header"
import { DialogPopup } from "./dialog-popup"
import { DialogPortal } from "./dialog-portal"
import { DialogRoot } from "./dialog-root"
import { DialogTitle } from "./dialog-title"
import { DialogTrigger } from "./dialog-trigger"

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Close: DialogClose,
  Backdrop: DialogBackdrop,
  Popup: DialogPopup,
  Title: DialogTitle,
  Description: DialogDescription,
  Header: DialogHeader,
  Footer: DialogFooter,
  Content: DialogContent,
})
