"use client"

import { cn } from "cn"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  CopyIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import { type ReactNode, useState } from "react"
import { Button } from "@/components/button"
import { ConfirmDialog } from "@/components/confirm-dialog"
import type { SortDirection } from "@/hooks/use-client-table.hook"

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

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowId: (row: T) => string
  onRowClick?: (row: T) => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void | Promise<void>
  canEdit?: (row: T) => boolean
  canDelete?: (row: T) => boolean
  deleteConfirmTitle?: string | ((row: T) => string)
  deleteConfirmDescription?: string | ((row: T) => string)
  sortKey?: string | null
  sortDirection?: SortDirection
  onSortChange?: (column: DataTableColumn<T>) => void
  hideActions?: boolean
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
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  deleteConfirmTitle,
  deleteConfirmDescription,
  sortKey,
  sortDirection,
  onSortChange,
  hideActions = false,
}: DataTableProps<T>) {
  const [deletingRow, setDeletingRow] = useState<T | null>(null)

  return (
    <>
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
              {!hideActions && (
                <th
                  scope="col"
                  className="w-28 px-4 py-2 text-right align-middle text-xs font-medium whitespace-nowrap text-muted-foreground"
                >
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hasEdit = Boolean(onEdit || onRowClick)
              const isEditAllowed = canEdit ? canEdit(row) : true
              const hasDelete = Boolean(onDelete)
              const isDeleteAllowed = canDelete ? canDelete(row) : true

              return (
                <tr
                  key={getRowId(row)}
                  className={cn(
                    "group/row border-b border-border/50 last:border-b-0",
                    onRowClick &&
                      "cursor-pointer transition-colors duration-200 hover:bg-secondary/40",
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
                  {!hideActions && (
                    <td className="px-4 py-2.5 text-right align-middle whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1">
                        <CopyIdButton id={getRowId(row)} />
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          title={hasEdit && isEditAllowed ? "Editar" : "Edição não disponível"}
                          aria-label="Editar"
                          disabled={!hasEdit || !isEditAllowed}
                          className={cn(
                            "text-muted-foreground transition-colors",
                            hasEdit && isEditAllowed
                              ? "hover:text-foreground hover:bg-secondary"
                              : "opacity-30 cursor-not-allowed",
                          )}
                          onClick={(event) => {
                            event.stopPropagation()
                            if (!hasEdit || !isEditAllowed) return
                            if (onEdit) {
                              onEdit(row)
                            } else if (onRowClick) {
                              onRowClick(row)
                            }
                          }}
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon-xs"
                          variant="ghost"
                          title={
                            hasDelete && isDeleteAllowed ? "Excluir" : "Exclusão não disponível"
                          }
                          aria-label="Excluir"
                          disabled={!hasDelete || !isDeleteAllowed}
                          className={cn(
                            "text-muted-foreground transition-colors",
                            hasDelete && isDeleteAllowed
                              ? "hover:text-destructive hover:bg-destructive/10"
                              : "opacity-30 cursor-not-allowed",
                          )}
                          onClick={(event) => {
                            event.stopPropagation()
                            if (!hasDelete || !isDeleteAllowed) return
                            setDeletingRow(row)
                          }}
                        >
                          <Trash2Icon className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {deletingRow && onDelete ? (
        <ConfirmDialog
          open={!!deletingRow}
          onOpenChange={(open) => {
            if (!open) setDeletingRow(null)
          }}
          title={
            typeof deleteConfirmTitle === "function"
              ? deleteConfirmTitle(deletingRow)
              : (deleteConfirmTitle ?? "Confirmar exclusão?")
          }
          description={
            typeof deleteConfirmDescription === "function"
              ? deleteConfirmDescription(deletingRow)
              : (deleteConfirmDescription ??
                "Tem certeza de que deseja excluir este registro? Esta ação não pode ser desfeita.")
          }
          confirmLabel="Excluir"
          destructive
          onConfirm={async () => {
            if (deletingRow && onDelete) {
              await onDelete(deletingRow)
              setDeletingRow(null)
            }
          }}
        />
      ) : null}
    </>
  )
}
