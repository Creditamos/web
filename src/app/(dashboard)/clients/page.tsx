"use client"

import { SearchIcon, UserPlusIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
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
import { type Client, useClients } from "@/features/clients"
import { applyClientTable, useClientTableState } from "@/hooks/use-client-table.hook"
import { formatDate, maskDocument, maskPhone } from "@/lib/format"
import { Can } from "@/lib/scopes"

const columns: DataTableColumn<Client>[] = [
  {
    key: "name",
    header: "Cliente",
    sortValue: (client) => client.name,
    cell: (client) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{client.name}</span>
        <span className="text-xs text-muted-foreground">{client.code}</span>
      </div>
    ),
  },
  {
    key: "document",
    header: "Documento",
    sortValue: (client) => client.documentNumber,
    cell: (client) => (
      <span className="font-mono text-xs">{maskDocument(client.documentNumber)}</span>
    ),
  },
  {
    key: "class",
    header: "Classificação",
    sortValue: (client) => client.class?.name ?? "",
    cell: (client) => (
      <div className="flex flex-col">
        <span className="text-sm">
          {client.class ? `${client.class.code} · ${client.class.name}` : "—"}
        </span>
        {client.subclass ? (
          <span className="text-xs text-muted-foreground">
            {client.subclass.code} · {client.subclass.name}
          </span>
        ) : null}
      </div>
    ),
  },
  {
    key: "personType",
    header: "Tipo",
    sortValue: (client) => client.personType,
    cell: (client) => (
      <span className="text-xs text-muted-foreground">
        {client.personType === "CORPORATE" ? "PJ" : "PF"}
      </span>
    ),
  },
  {
    key: "phone",
    header: "Telefone",
    sortValue: (client) => client.phone ?? "",
    cell: (client) => <span className="text-sm">{maskPhone(client.phone)}</span>,
  },
  {
    key: "status",
    header: "Status",
    sortValue: (client) => (client.isActive ? "0" : "1"),
    cell: (client) => (
      <StatusBadge tone={client.isActive ? "success" : "muted"}>
        {client.isActive ? "Ativo" : "Inativo"}
      </StatusBadge>
    ),
  },
  {
    key: "createdAt",
    header: "Criado em",
    sortValue: (client) => client.createdAt,
    cell: (client) => <span className="text-sm">{formatDate(client.createdAt)}</span>,
  },
]

export default function ClientsPage() {
  const router = useRouter()
  const { data: clients, isLoading, error } = useClients()
  const { state, setSearch, toggleSort, setPage } = useClientTableState({ sortKey: "name" })

  const items = clients ?? []
  const { rows, totalItems, totalPages, page, pageSize } = applyClientTable({
    items,
    state,
    searchText: (client) =>
      [client.name, client.code, client.documentNumber, client.class?.name ?? ""].join(" "),
    getSortValue: columnSortValues(columns),
    defaultSortKey: "name",
    pageSize: 10,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Carteira de clientes da operação."
        actions={
          <Can scope="clients:create">
            <Link href="/clients/new">
              <Button>
                <UserPlusIcon />
                Novo cliente
              </Button>
            </Link>
          </Can>
        }
      />

      <TablePanel
        toolbar={
          <SearchInput
            value={state.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nome, código ou documento"
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
          <ErrorNote>Não foi possível carregar os clientes. {error.message}</ErrorNote>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="size-5" />}
            title="Nenhum cliente cadastrado"
            description="Cadastre o primeiro cliente para começar a montar a carteira."
            actions={
              <Can scope="clients:create">
                <Link href="/clients/new">
                  <Button variant="outline">
                    <UserPlusIcon />
                    Novo cliente
                  </Button>
                </Link>
              </Can>
            }
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos clientes para “${state.search}”.`}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(client) => client.id}
            onRowClick={(client) => router.push(`/clients/${client.id}`)}
            sortKey={state.sortKey}
            sortDirection={state.sortDirection}
            onSortChange={(column) => toggleSort(column.key)}
          />
        )}
      </TablePanel>
    </div>
  )
}
