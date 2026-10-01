import { cn } from "cn"
import type * as React from "react"

function CardRoot({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-[var(--radius)] bg-card py-(--card-spacing) text-sm text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md ring-1 ring-border/50 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] *:[img:first-child]:rounded-t-[var(--radius)] *:[img:last-child]:rounded-b-[var(--radius)]",
        className,
      )}
      {...props}
    />
  )
}

export { CardRoot }
