import type * as React from "react";

import { cn } from "@/lib/utils";

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 text-left pt-6 px-6", className)}
      {...props}
    />
  );
}
