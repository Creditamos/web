import { cn } from "cn"
import type { ReactNode } from "react"

export interface DetailItem {
  label: string
  value: ReactNode
}

interface DetailListProps {
  items: DetailItem[]
  className?: string
}

export function DetailList({ items, className }: DetailListProps) {
  return (
    <dl className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-4 py-2.5">
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="text-right text-sm font-medium text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
