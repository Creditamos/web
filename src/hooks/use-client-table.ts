"use client"

import { useState } from "react"

export type SortDirection = "asc" | "desc"

export interface ClientTableState {
  search: string
  sortKey: string | null
  sortDirection: SortDirection
  page: number
}

export function useClientTableState(initial: Partial<ClientTableState> = {}): {
  state: ClientTableState
  setSearch: (search: string) => void
  toggleSort: (key: string) => void
  setPage: (page: number) => void
} {
  const [state, setState] = useState<ClientTableState>({
    search: "",
    sortKey: null,
    sortDirection: "asc",
    page: 1,
    ...initial,
  })

  const setSearch = (search: string) => setState((prev) => ({ ...prev, search, page: 1 }))
  const setPage = (page: number) => setState((prev) => ({ ...prev, page }))
  const toggleSort = (key: string) =>
    setState((prev) => {
      if (prev.sortKey === key) {
        return {
          ...prev,
          sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
          page: 1,
        }
      }
      return { ...prev, sortKey: key, sortDirection: "asc", page: 1 }
    })

  return { state, setSearch, toggleSort, setPage }
}

export interface ApplyClientTableOptions<T> {
  items: T[]
  state: ClientTableState
  searchText?: (item: T) => string
  getSortValue: Record<string, (item: T) => string | number | null | undefined>
  defaultSortKey?: string
  pageSize?: number
}

function compareValues(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
): number {
  if (a === b) return 0
  if (a === null || a === undefined) return 1
  if (b === null || b === undefined) return -1
  if (typeof a === "number" && typeof b === "number") return a - b
  return String(a).localeCompare(String(b), "pt-BR", { numeric: true })
}

export interface ApplyClientTableResult<T> {
  rows: T[]
  totalItems: number
  totalPages: number
  page: number
  pageSize: number
}

export function applyClientTable<T>({
  items,
  state,
  searchText,
  getSortValue,
  defaultSortKey,
  pageSize = 10,
}: ApplyClientTableOptions<T>): ApplyClientTableResult<T> {
  let rows = items

  if (state.search && searchText) {
    const term = state.search.toLowerCase()
    rows = rows.filter((item) => searchText(item).toLowerCase().includes(term))
  }

  const sortKey = state.sortKey ?? defaultSortKey ?? null
  if (sortKey) {
    const getter = getSortValue[sortKey]
    if (getter) {
      const direction = state.sortDirection === "desc" ? -1 : 1
      rows = [...rows].sort((a, b) => compareValues(getter(a), getter(b)) * direction)
    }
  }

  const totalItems = rows.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const page = Math.min(Math.max(1, state.page), totalPages)
  const paged = rows.slice((page - 1) * pageSize, page * pageSize)

  return { rows: paged, totalItems, totalPages, page, pageSize }
}
