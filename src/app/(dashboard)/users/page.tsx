"use client"

import { SearchIcon, UserPlusIcon, UsersIcon } from "lucide-react"
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
import type { User } from "@/features/users"
import { useDeleteUser, useUsers } from "@/features/users"
import { applyClientTable, useClientTableState } from "@/hooks/use-client-table.hook"
import { formatDate } from "@/lib/format"
import { Can } from "@/lib/scopes"

const columns: DataTableColumn<User>[] = [
  {
    key: "name",
    header: "Nome",
    sortValue: (user) => user.name,
    cell: (user) => <span className="font-medium text-foreground">{user.name}</span>,
  },
  {
    key: "email",
    header: "E-mail",
    sortValue: (user) => user.email,
    cell: (user) => <span className="text-sm text-muted-foreground">{user.email}</span>,
  },
  {
    key: "roles",
    header: "Perfis",
    sortValue: (user) => user.roleNames.join(","),
    cell: (user) =>
      user.roleNames.length === 0 ? (
        <span className="text-sm text-muted-foreground">—</span>
      ) : (
        <span className="text-xs text-muted-foreground">{user.roleNames.join(" · ")}</span>
      ),
  },
  {
    key: "isActive",
    header: "Status",
    sortValue: (user) => (user.isActive ? "A" : "B"),
    cell: (user) => (
      <StatusBadge tone={user.isActive ? "success" : "muted"}>
        {user.isActive ? "Ativo" : "Inativo"}
      </StatusBadge>
    ),
  },
  {
    key: "lastLoginAt",
    header: "Último acesso",
    sortValue: (user) => user.lastLoginAt ?? "",
    cell: (user) => (
      <span className="text-sm">{user.lastLoginAt ? formatDate(user.lastLoginAt) : "Nunca"}</span>
    ),
  },
]

export default function UsersPage() {
  const router = useRouter()
  const { data: users, isLoading, error } = useUsers()
  const deleteUser = useDeleteUser()
  const { state, setSearch, toggleSort, setPage } = useClientTableState({ sortKey: "name" })

  const items = users ?? []
  const { rows, totalItems, totalPages, page, pageSize } = applyClientTable({
    items,
    state,
    searchText: (user) => [user.name, user.email, ...user.roleNames].join(" "),
    getSortValue: columnSortValues(columns),
    defaultSortKey: "name",
    pageSize: 10,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuários"
        description="Contas com acesso ao painel administrativo."
        actions={
          <Can scope="users:create">
            <Button onClick={() => router.push("/users/new")}>
              <UserPlusIcon />
              Convidar usuário
            </Button>
          </Can>
        }
      />

      <TablePanel
        toolbar={
          <SearchInput
            value={state.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, e-mail ou perfil"
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
          <ErrorNote>Não foi possível carregar os usuários. {error.message}</ErrorNote>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="size-5" />}
            title="Nenhum usuário cadastrado"
            description="As contas de acesso ao painel aparecerão aqui."
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos usuários para “${state.search}”.`}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(user) => user.id}
            onRowClick={(user) => router.push(`/users/${user.id}`)}
            onEdit={(user) => router.push(`/users/${user.id}`)}
            onDelete={async (user) => {
              await deleteUser.mutateAsync(user.id)
            }}
            deleteConfirmTitle={(user) => `Excluir usuário "${user.name}"?`}
            deleteConfirmDescription={(user) =>
              `O usuário ${user.name} (${user.email}) será excluído.`
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
