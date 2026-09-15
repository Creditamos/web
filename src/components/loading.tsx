import { cn } from "cn"

interface LoadingProps {
  className?: string
  label?: string
}

export function Loading({ className, label = "Carregando" }: LoadingProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("flex items-center justify-center py-16", className)}
    >
      <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground/60" />
    </div>
  )
}
