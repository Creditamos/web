import { DialogRoot } from "./dialog-root";
import { DialogTrigger } from "./dialog-trigger";
import { DialogPortal } from "./dialog-portal";
import { DialogClose } from "./dialog-close";
import { DialogBackdrop } from "./dialog-backdrop";
import { DialogPopup } from "./dialog-popup";
import { DialogTitle } from "./dialog-title";
import { DialogDescription } from "./dialog-description";
import { DialogHeader } from "./dialog-header";
import { DialogFooter } from "./dialog-footer";
import { DialogContent } from "./dialog-content";

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
});
