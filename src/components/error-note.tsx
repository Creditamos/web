import { cn } from "cn"
import type { ReactNode } from "react"

interface ErrorNoteProps {
  children: ReactNode
  className?: string
}

export function ErrorNote({ children, className }: ErrorNoteProps) {
  return (
    <div
      role="alert"
      className={cn(
        "m-4 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-sm text-destructive",
        className,
      )}
    >
      {children}
    </div>
  )
}
