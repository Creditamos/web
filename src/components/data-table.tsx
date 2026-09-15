import { cn } from "cn"
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, CopyIcon } from "lucide-react"
import { type ReactNode, useState } from "react"
import { Button } from "@/components/button"
import type { SortDirection } from "@/hooks/use-client-table"

export interface DataTableColumn<T> {
  key: string
  header: ReactNode
  cell: (row: T) => ReactNode
  sortValue?: (row: T) => string | number | null | undefined
  align?: "left" | "right"
  className?: string
  headerClassName?: string
}

export type SortValueAccessor<T> = (row: T) => string | number | null | undefined

export function columnSortValues<T>(
  columns: DataTableColumn<T>[],
): Record<string, SortValueAccessor<T>> {
  const accessors: Record<string, SortValueAccessor<T>> = {}
  for (const column of columns) {
    if (column.sortValue) accessors[column.key] = column.sortValue
  }
  return accessors
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  onRowClick?: (row: T) => void
  sortKey?: string | null
  sortDirection?: SortDirection
  onSortChange?: (column: DataTableColumn<T>) => void
}

function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(id)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard indisponível — ignora
    }
  }

  return (
    <Button
      size="icon-xs"
      variant="ghost"
      title="Copiar ID"
      aria-label="Copiar ID"
      className="opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100"
      onClick={(event) => {
        event.stopPropagation()
        void handleCopy()
      }}
    >
      {copied ? (
        <CheckIcon className="text-success" />
      ) : (
        <CopyIcon className="text-muted-foreground" />
      )}
    </Button>
  )
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  sortKey,
  sortDirection,
  onSortChange,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {columns.map((column) => {
              const sortable = !!column.sortValue && !!onSortChange
              const isActive = sortKey === column.key
              return (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-4 py-2 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground",
                    column.align === "right" && "text-right",
                    column.headerClassName,
                  )}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => onSortChange?.(column)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
                        column.align === "right" && "flex-row-reverse",
                        isActive && "text-foreground",
                      )}
                    >
                      {column.header}
                      {isActive ? (
                        sortDirection === "asc" ? (
                          <ArrowUpIcon className="size-3" />
                        ) : (
                          <ArrowDownIcon className="size-3" />
                        )
                      ) : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              )
            })}
            <th className="w-10 px-2 py-2" aria-label="" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowId(row)}
              className={cn(
                "group/row border-b border-border last:border-b-0",
                onRowClick && "cursor-pointer transition-colors hover:bg-muted/40",
              )}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-4 py-2.5 align-middle text-muted-foreground",
                    column.align === "right" && "text-right",
                    column.className,
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
              <td className="px-2 py-2.5 text-right align-middle">
                <CopyIdButton id={getRowId(row)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
