import { cn } from "cn"
import type { ReactNode } from "react"

interface PageHeaderProps {
  title: ReactNode
  description?: string
  breadcrumb?: ReactNode
  actions?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}
    >
      <div className="min-w-0 space-y-1.5">
        {breadcrumb ? <div>{breadcrumb}</div> : null}
        <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2 sm:pb-0.5">{actions}</div> : null}
    </div>
  )
}
