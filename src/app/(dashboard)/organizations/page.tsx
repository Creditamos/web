"use client"

import { BuildingIcon, SearchIcon, PlusIcon } from "lucide-react"
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
import type { Organization } from "@/features/organizations"
import { useOrganizations } from "@/features/organizations"
import { applyClientTable, useClientTableState } from "@/hooks/use-client-table.hook"
import { Can } from "@/lib/scopes"

const columns: DataTableColumn<Organization>[] = [
  {
    key: "name",
    header: "Nome",
    sortValue: (org) => org.name,
    cell: (org) => (
      <span className="font-mono text-sm font-medium text-foreground">{org.name}</span>
    ),
  },
  {
    key: "document",
    header: "Documento",
    sortValue: (org) => org.document,
    cell: (org) => <span className="text-sm">{org.document || "—"}</span>,
  },
  {
    key: "email",
    header: "Email",
    sortValue: (org) => org.email ?? "",
    cell: (org) => <span className="text-sm">{org.email || "—"}</span>,
  },
  {
    key: "isActive",
    header: "Status",
    sortValue: (org) => (org.isActive ? "A" : "B"),
    cell: (org) => (
      <StatusBadge tone={org.isActive ? "success" : "muted"}>
        {org.isActive ? "Ativa" : "Inativa"}
      </StatusBadge>
    ),
  },
]

export default function OrganizationsPage() {
  const router = useRouter()
  const { data: organizations, isLoading, error } = useOrganizations()
  const { state, setSearch, toggleSort, setPage } = useClientTableState({ sortKey: "name" })

  const items = organizations ?? []
  const { rows, totalItems, totalPages, page, pageSize } = applyClientTable({
    items,
    state,
    searchText: (org) => [org.name, org.document].join(" "),
    getSortValue: columnSortValues(columns),
    defaultSortKey: "name",
    pageSize: 10,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Organizações"
        description="Gerencie as organizações cadastradas no sistema."
        actions={
          <Can scope="organizations:create">
            <Button onClick={() => router.push("/organizations/new")}>
              <PlusIcon />
              Nova organização
            </Button>
          </Can>
        }
      />

      <TablePanel
        toolbar={
          <SearchInput
            value={state.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou documento"
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
          <ErrorNote>Não foi possível carregar as organizações. {error.message}</ErrorNote>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<BuildingIcon className="size-5" />}
            title="Nenhuma organização cadastrada"
            description="As organizações cadastradas aparecerão aqui."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos organizações para “${state.search}”.`}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(org) => org.id}
            onRowClick={(org) => router.push(`/organizations/${org.id}`)}
            sortKey={state.sortKey}
            sortDirection={state.sortDirection}
            onSortChange={(column) => toggleSort(column.key)}
          />
        )}
      </TablePanel>
    </div>
  )
}
