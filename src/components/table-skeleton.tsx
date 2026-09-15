import { cn } from "cn"
import { Skeleton } from "@/components/skeleton"

interface TableSkeletonProps {
  rows?: number
  className?: string
}

export function TableSkeleton({ rows = 8, className }: TableSkeletonProps) {
  return (
    <div className={cn("divide-y divide-border", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 px-4 py-3">
          <Skeleton className="h-4 w-40 max-w-[35%] shrink-0" />
          <Skeleton className="h-4 w-24 shrink-0" />
          <Skeleton className="h-4 w-16 shrink-0" />
          <Skeleton className="ml-auto h-4 w-20 shrink-0" />
        </div>
      ))}
    </div>
  )
}
