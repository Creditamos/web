"use client"

import { KeyRoundIcon, SearchIcon, ShieldPlusIcon } from "lucide-react"
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
import type { Role } from "@/features/roles"
import { useRoles } from "@/features/roles"
import { applyClientTable, useClientTableState } from "@/hooks/use-client-table"
import { Can } from "@/lib/scopes"

const columns: DataTableColumn<Role>[] = [
  {
    key: "name",
    header: "Nome",
    sortValue: (role) => role.name,
    cell: (role) => (
      <span className="font-mono text-sm font-medium text-foreground">{role.name}</span>
    ),
  },
  {
    key: "description",
    header: "Descrição",
    sortValue: (role) => role.description ?? "",
    cell: (role) => <span className="text-sm">{role.description ?? "—"}</span>,
  },
  {
    key: "scopes",
    header: "Permissões",
    sortValue: (role) => role.scopes.length,
    cell: (role) => (
      <span className="text-sm tabular-nums">
        {role.scopes.length} scope{role.scopes.length === 1 ? "" : "s"}
      </span>
    ),
  },
  {
    key: "userCount",
    header: "Usuários",
    align: "right",
    sortValue: (role) => role.userCount,
    cell: (role) => <span className="text-sm tabular-nums">{role.userCount}</span>,
  },
  {
    key: "isActive",
    header: "Status",
    sortValue: (role) => (role.isActive ? "A" : "B"),
    cell: (role) => (
      <StatusBadge tone={role.isActive ? "success" : "muted"}>
        {role.isActive ? "Ativa" : "Inativa"}
      </StatusBadge>
    ),
  },
]

export default function RolesPage() {
  const router = useRouter()
  const { data: roles, isLoading, error } = useRoles()
  const { state, setSearch, toggleSort, setPage } = useClientTableState({ sortKey: "name" })

  const items = roles ?? []
  const { rows, totalItems, totalPages, page, pageSize } = applyClientTable({
    items,
    state,
    searchText: (role) => [role.name, role.description ?? ""].join(" "),
    getSortValue: columnSortValues(columns),
    defaultSortKey: "name",
    pageSize: 10,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Perfis & Permissões"
        description="Roles de acesso e os scopes concedidos a cada uma."
        actions={
          <Can scope="roles:create">
            <Button onClick={() => router.push("/roles/new")}>
              <ShieldPlusIcon />
              Nova role
            </Button>
          </Can>
        }
      />

      <TablePanel
        toolbar={
          <SearchInput
            value={state.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome ou descrição"
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
          <ErrorNote>Não foi possível carregar as roles. {error.message}</ErrorNote>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<KeyRoundIcon className="size-5" />}
            title="Nenhuma role cadastrada"
            description="As roles de acesso aparecerão aqui."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos roles para “${state.search}”.`}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(role) => role.id}
            onRowClick={(role) => router.push(`/roles/${role.id}`)}
            sortKey={state.sortKey}
            sortDirection={state.sortDirection}
            onSortChange={(column) => toggleSort(column.key)}
          />
        )}
      </TablePanel>
    </div>
  )
}
