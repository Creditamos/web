"use client"

import { MapPinIcon, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/button"
import { columnSortValues, DataTable, type DataTableColumn } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { ErrorNote } from "@/components/error-note"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import { SearchInput } from "@/components/search-input"
import { SegmentedControl } from "@/components/segmented-control"
import { StatusBadge } from "@/components/status-badge"
import { TablePanel } from "@/components/table-panel"
import { TableSkeleton } from "@/components/table-skeleton"
import type { Operator } from "@/features/operators"
import { useOperators } from "@/features/operators"
import { applyClientTable, useClientTableState } from "@/hooks/use-client-table.hook"
import { formatDate, maskPhone } from "@/lib/format"
import { Can } from "@/lib/scopes"

type ActiveFilter = "all" | "active" | "inactive"

const ACTIVE_OPTIONS: Array<{ value: ActiveFilter; label: string }> = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "inactive", label: "Inativos" },
]

const columns: DataTableColumn<Operator>[] = [
  {
    key: "code",
    header: "Código",
    sortValue: (operator) => operator.code,
    cell: (operator) => <span className="font-mono text-xs text-foreground">{operator.code}</span>,
  },
  {
    key: "fullName",
    header: "Operador",
    sortValue: (operator) => operator.fullName,
    cell: (operator) => <span className="font-medium text-foreground">{operator.fullName}</span>,
  },
  {
    key: "supplier",
    header: "Banco",
    sortValue: (operator) => operator.supplier?.name ?? "",
    cell: (operator) =>
      operator.supplier ? (
        <span className="text-sm">
          {operator.supplier.code} · {operator.supplier.name}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
  },
  {
    key: "phone",
    header: "Telefone",
    sortValue: (operator) => operator.phone ?? "",
    cell: (operator) => (
      <span className="text-sm">{operator.phone ? maskPhone(operator.phone) : "—"}</span>
    ),
  },
  {
    key: "isActive",
    header: "Status",
    sortValue: (operator) => (operator.isActive ? "A" : "B"),
    cell: (operator) => (
      <StatusBadge tone={operator.isActive ? "success" : "muted"}>
        {operator.isActive ? "Ativo" : "Inativo"}
      </StatusBadge>
    ),
  },
  {
    key: "createdAt",
    header: "Criado em",
    sortValue: (operator) => operator.createdAt,
    cell: (operator) => <span className="text-sm">{formatDate(operator.createdAt)}</span>,
  },
]

export default function OperatorsPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all")
  const {
    data: operators,
    isLoading,
    error,
  } = useOperators(activeFilter === "all" ? undefined : activeFilter === "active")
  const { state, setSearch, toggleSort, setPage } = useClientTableState({ sortKey: "fullName" })

  const items = operators ?? []
  const { rows, totalItems, totalPages, page, pageSize } = applyClientTable({
    items,
    state,
    searchText: (operator) =>
      [
        operator.code,
        operator.fullName,
        operator.supplier?.name ?? "",
        operator.supplier?.code ?? "",
        operator.phone ?? "",
      ].join(" "),
    getSortValue: columnSortValues(columns),
    defaultSortKey: "fullName",
    pageSize: 10,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operadores"
        description="Operadores dos bancos parceiros que atendem as propostas de crédito."
        actions={
          <Can scope="operators:create">
            <Button onClick={() => router.push("/operators/new")}>Cadastrar operador</Button>
          </Can>
        }
      />

      <TablePanel
        toolbar={
          <div className="flex flex-wrap items-center gap-3">
            <SegmentedControl
              options={ACTIVE_OPTIONS}
              value={activeFilter}
              onValueChange={setActiveFilter}
              aria-label="Filtrar por status"
            />
            <SearchInput
              value={state.search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, banco ou telefone"
              containerClassName="w-full max-w-72"
            />
          </div>
        }
        footer={
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        }
      >
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorNote>Não foi possível carregar os operadores. {error.message}</ErrorNote>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<MapPinIcon className="size-5" />}
            title="Nenhum operador cadastrado"
            description="Os operadores aparecerão aqui depois de cadastrados."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos operadores para “${state.search}”.`}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(operator) => operator.id}
            onRowClick={(operator) => router.push(`/operators/${operator.id}`)}
            sortKey={state.sortKey}
            sortDirection={state.sortDirection}
            onSortChange={(column) => toggleSort(column.key)}
          />
        )}
      </TablePanel>
    </div>
  )
}
