"use client"

import { BanknoteIcon, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/button"
import { columnSortValues, DataTable, type DataTableColumn } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { ErrorNote } from "@/components/error-note"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import { SearchInput } from "@/components/search-input"
import { StatusBadge } from "@/components/status-badge"
import { TablePanel } from "@/components/table-panel"
import { TableSkeleton } from "@/components/table-skeleton"
import type { Supplier } from "@/features/suppliers"
import { useDeleteSupplier, useSuppliers } from "@/features/suppliers"
import { applyClientTable, useClientTableState } from "@/hooks/use-client-table.hook"
import { formatDate } from "@/lib/format"
import { Can } from "@/lib/scopes"

const columns: DataTableColumn<Supplier>[] = [
  {
    key: "code",
    header: "Código",
    sortValue: (supplier) => supplier.code,
    cell: (supplier) => <span className="font-mono text-xs text-foreground">{supplier.code}</span>,
  },
  {
    key: "name",
    header: "Fornecedor",
    sortValue: (supplier) => supplier.name,
    cell: (supplier) => <span className="font-medium text-foreground">{supplier.name}</span>,
  },
  {
    key: "class",
    header: "Classificação",
    sortValue: (supplier) => supplier.class?.code ?? "",
    cell: (supplier) => (
      <div className="flex flex-col">
        <span className="text-sm">{supplier.class?.name ?? "—"}</span>
        {supplier.subclass ? (
          <span className="text-xs text-muted-foreground">{supplier.subclass.name}</span>
        ) : null}
      </div>
    ),
  },
  {
    key: "isActive",
    header: "Status",
    sortValue: (supplier) => (supplier.isActive ? "A" : "B"),
    cell: (supplier) => (
      <StatusBadge tone={supplier.isActive ? "success" : "muted"}>
        {supplier.isActive ? "Ativo" : "Inativo"}
      </StatusBadge>
    ),
  },
  {
    key: "createdAt",
    header: "Criado em",
    sortValue: (supplier) => supplier.createdAt,
    cell: (supplier) => <span className="text-sm">{formatDate(supplier.createdAt)}</span>,
  },
]

export default function SuppliersPage() {
  const router = useRouter()
  const { data: suppliers, isLoading, error } = useSuppliers()
  const deleteSupplier = useDeleteSupplier()
  const { state, setSearch, toggleSort, setPage } = useClientTableState({ sortKey: "name" })

  const items = suppliers ?? []
  const { rows, totalItems, totalPages, page, pageSize } = applyClientTable({
    items,
    state,
    searchText: (supplier) =>
      [
        supplier.code,
        supplier.name,
        supplier.class?.name ?? "",
        supplier.subclass?.name ?? "",
      ].join(" "),
    getSortValue: columnSortValues(columns),
    defaultSortKey: "name",
    pageSize: 10,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fornecedores"
        description="Instituições parceiras que originam produtos de crédito."
        actions={
          <Can scope="suppliers:create">
            <Button onClick={() => router.push("/suppliers/new")}>Cadastrar fornecedor</Button>
          </Can>
        }
      />

      <TablePanel
        toolbar={
          <SearchInput
            value={state.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por código, nome ou classe"
            containerClassName="w-full max-w-72"
          />
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
          <ErrorNote>Não foi possível carregar os fornecedores. {error.message}</ErrorNote>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<BanknoteIcon className="size-5" />}
            title="Nenhum fornecedor cadastrado"
            description="Os fornecedores aparecerão aqui depois de cadastrados."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos fornecedores para “${state.search}”.`}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(supplier) => supplier.id}
            onRowClick={(supplier) => router.push(`/suppliers/${supplier.id}`)}
            onEdit={(supplier) => router.push(`/suppliers/${supplier.id}`)}
            onDelete={async (supplier) => {
              await deleteSupplier.mutateAsync(supplier.id)
            }}
            deleteConfirmTitle={(supplier) => `Excluir fornecedor "${supplier.name}"?`}
            deleteConfirmDescription={(supplier) =>
              `O fornecedor ${supplier.name} (${supplier.code}) deixará de aparecer nas listas.`
            }
            sortKey={state.sortKey}
            sortDirection={state.sortDirection}
            onSortChange={(column) => toggleSort(column.key)}
          />
        )}
      </TablePanel>
    </div>
  )
}
