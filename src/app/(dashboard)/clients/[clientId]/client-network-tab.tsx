import { cn } from "cn"
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

function getColumns(clientId: string): DataTableColumn<Client>[] {
  return [
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
      key: "relationship",
      header: "Vínculo",
      sortValue: (client) => (client.masterAgent === clientId ? "0" : "1"),
      cell: (client) => {
        const isMaster = client.masterAgent === clientId
        return (
          <span
            className={cn(
              "inline-flex items-center text-[10px] uppercase font-semibold tracking-wider border px-1.5 py-0.5 rounded-md",
              isMaster
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted/30 text-muted-foreground border-border",
            )}
          >
            {isMaster
              ? "Indicado / Parceiro"
              : client.personType === "CORPORATE"
                ? "Filial"
                : "Vendedor"}
          </span>
        )
      },
    },
    {
      key: "personType",
      header: "Tipo",
      sortValue: (client) => client.personType,
      cell: (client) => (
        <span className="inline-flex items-center text-[10px] uppercase font-semibold tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded-md bg-muted/30">
          {client.personType === "CORPORATE" ? "PJ" : "PF"}
        </span>
      ),
    },
    {
      key: "classification",
      header: "Classificação",
      sortValue: (client) => client.subclass?.name ?? client.class?.name ?? "",
      cell: (client) => (
        <span className="text-xs text-muted-foreground">
          {client.subclass?.name ?? client.class?.name ?? "—"}
        </span>
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
}

export function ClientNetworkTab({ clientId }: { clientId: string }) {
  const router = useRouter()
  const { data: clients, isLoading, error } = useClients()

  if (error) {
    return <ErrorNote>Não foi possível carregar a rede: {error.message}</ErrorNote>
  }

  // Dependentes: Qualquer cliente cujo headquarters seja o cliente atual OU cujo masterAgent seja o cliente atual
  const network =
    clients?.filter((c) => c.headquarters === clientId || c.masterAgent === clientId) ?? []

  if (!isLoading && network.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-5" />}
        title="Rede vazia"
        description="Nenhum parceiro indicado, filial ou vendedor está vinculado a este cadastro no momento."
        actions={
          <Can scope="clients:create">
            <Link href="/clients/new">
              <Button variant="outline">
                <UserPlusIcon />
                Cadastrar novo parceiro/cliente
              </Button>
            </Link>
          </Can>
        }
      />
    )
  }

  const columns = getColumns(clientId)

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
