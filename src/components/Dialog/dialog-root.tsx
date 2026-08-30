import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type * as React from "react";

export function DialogRoot(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}
