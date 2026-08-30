import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type * as React from "react";

import { cn } from "@/lib/utils";

export function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-1 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
