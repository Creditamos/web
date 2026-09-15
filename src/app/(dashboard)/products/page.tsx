"use client"

import { PackageIcon, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { columnSortValues, DataTable, type DataTableColumn } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { ErrorNote } from "@/components/error-note"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import { SearchInput } from "@/components/search-input"
import { TablePanel } from "@/components/table-panel"
import { TableSkeleton } from "@/components/table-skeleton"
import { type CreditProduct, useProducts } from "@/features/products"
import { applyClientTable, useClientTableState } from "@/hooks/use-client-table"
import { formatDate } from "@/lib/format"

const columns: DataTableColumn<CreditProduct>[] = [
  {
    key: "code",
    header: "Código",
    sortValue: (product) => product.code,
    cell: (product) => <span className="font-mono text-xs text-foreground">{product.code}</span>,
  },
  {
    key: "name",
    header: "Produto",
    sortValue: (product) => product.name,
    cell: (product) => <span className="font-medium text-foreground">{product.name}</span>,
  },
  {
    key: "supplier",
    header: "Fornecedor",
    sortValue: (product) => product.supplier ?? "",
    cell: (product) => <span className="text-sm">{product.supplier ?? "—"}</span>,
  },
  {
    key: "class",
    header: "Classificação",
    sortValue: (product) => product.class ?? "",
    cell: (product) => (
      <div className="flex flex-col">
        <span className="text-sm">{product.class ?? "—"}</span>
        {product.subclass ? (
          <span className="text-xs text-muted-foreground">{product.subclass}</span>
        ) : null}
      </div>
    ),
  },
  {
    key: "clientTypes",
    header: "Público",
    sortValue: (product) => (product.clientTypes.includes("INDIVIDUAL") ? "A" : "B"),
    cell: (product) => (
      <span className="text-xs text-muted-foreground">
        {product.clientTypes.includes("CORPORATE")
          ? product.clientTypes.includes("INDIVIDUAL")
            ? "PJ e PF"
            : "PJ"
          : "PF"}
      </span>
    ),
  },
  {
    key: "createdAt",
    header: "Criado em",
    sortValue: (product) => product.createdAt,
    cell: (product) => <span className="text-sm">{formatDate(product.createdAt)}</span>,
  },
]

export default function ProductsPage() {
  const router = useRouter()
  const { data: products, isLoading, error } = useProducts()
  const { state, setSearch, toggleSort, setPage } = useClientTableState({ sortKey: "name" })

  const items = products ?? []
  const { rows, totalItems, totalPages, page, pageSize } = applyClientTable({
    items,
    state,
    searchText: (product) => [product.code, product.name, product.supplier ?? ""].join(" "),
    getSortValue: columnSortValues(columns),
    defaultSortKey: "name",
    pageSize: 10,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Produtos"
        description="Portfólio de produtos de crédito disponíveis nas propostas."
      />

      <TablePanel
        toolbar={
          <SearchInput
            value={state.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por código, nome ou fornecedor"
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
          <ErrorNote>Não foi possível carregar os produtos. {error.message}</ErrorNote>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<PackageIcon className="size-5" />}
            title="Nenhum produto ativo"
            description="Os produtos ativos do portfólio aparecerão aqui."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos produtos para “${state.search}”.`}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(product) => product.id}
            onRowClick={(product) => router.push(`/products/${product.id}`)}
            sortKey={state.sortKey}
            sortDirection={state.sortDirection}
            onSortChange={(column) => toggleSort(column.key)}
          />
        )}
      </TablePanel>
    </div>
  )
}
