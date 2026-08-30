import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type * as React from "react";

import { cn } from "@/lib/utils";

export function DialogPopup({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Popup>) {
  return (
    <DialogPrimitive.Popup
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 text-card-foreground shadow-lg outline-none data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 transition-[transform,opacity]",
        className,
      )}
      {...props}
    />
  );
}
