import { cn } from "cn"
import type { ReactNode } from "react"
import type { StatusTone } from "@/features/proposals/proposal-status"

const TONE_DOT_STYLES: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-sky-500 dark:bg-sky-400",
  muted: "bg-muted-foreground/40",
}

const TONE_TEXT_STYLES: Record<StatusTone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-sky-700 dark:text-sky-300",
  muted: "text-muted-foreground",
}

interface StatusBadgeProps {
  tone: StatusTone
  children: ReactNode
  className?: string
}

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap",
        TONE_TEXT_STYLES[tone],
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT_STYLES[tone])} />
      {children}
    </span>
  )
}
