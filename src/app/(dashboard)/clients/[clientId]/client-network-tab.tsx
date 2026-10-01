import { UserPlusIcon, UsersIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/button"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { ErrorNote } from "@/components/error-note"
import { StatusBadge } from "@/components/status-badge"
import { type Client, useClients } from "@/features/clients"
import { maskDocument, maskPhone } from "@/lib/format"
import { Can } from "@/lib/scopes"

const columns: DataTableColumn<Client>[] = [
  {
    key: "name",
    header: "Nome / Razão Social",
    sortValue: (client) => client.name,
    cell: (client) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{client.name}</span>
        <span className="text-xs text-muted-foreground">{client.code}</span>
      </div>
    ),
  },
  {
    key: "personType",
    header: "Tipo",
    sortValue: (client) => client.personType,
    cell: (client) => {
      let label = "PF"
      if (client.personType === "CORPORATE") {
        label = client.headquarters ? "Filial" : "Matriz"
      } else {
        label = "Vendedor"
      }
      return (
        <span className="inline-flex items-center text-[10px] uppercase font-semibold tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded-md bg-muted/30">
          {label}
        </span>
      )
    },
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
]

export function ClientNetworkTab({ clientId }: { clientId: string }) {
  const router = useRouter()
  const { data: clients, isLoading, error } = useClients()

  if (error) {
    return <ErrorNote>Não foi possível carregar a rede: {error.message}</ErrorNote>
  }

  // Dependentes: Qualquer cliente cujo headquarters seja o cliente atual
  const network = clients?.filter((c) => c.headquarters === clientId) ?? []

  if (!isLoading && network.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-5" />}
        title="Rede vazia"
        description="Nenhuma filial ou vendedor está vinculado a esta empresa no momento."
        actions={
          <Can scope="clients:create">
            <Link href="/clients/new">
              <Button variant="outline">
                <UserPlusIcon />
                Vincular nova unidade/vendedor
              </Button>
            </Link>
          </Can>
        }
      />
    )
  }

  return (
    <div className="rounded-md border border-border bg-background">
      <DataTable
        columns={columns}
        rows={network}
        getRowId={(client) => client.id}
        onRowClick={(client) => router.push(`/clients/${client.id}`)}
        sortKey="name"
        sortDirection="asc"
      />
    </div>
  )
}
