import { cn } from "cn"
import type { ReactNode } from "react"

interface TablePanelProps {
  toolbar?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export function TablePanel({ toolbar, footer, children, className }: TablePanelProps) {
  return (
    <section
      data-slot="table-panel"
      className={cn("overflow-hidden rounded-lg border border-border bg-card shadow-xs", className)}
    >
      {toolbar ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2.5">
          {toolbar}
        </div>
      ) : null}
      {children}
      {footer ? <div className="border-t border-border bg-card px-4 py-2.5">{footer}</div> : null}
    </section>
  )
}
