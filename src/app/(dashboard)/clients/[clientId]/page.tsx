"use client"

import { cn } from "cn"
import { FileIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import { BackLink } from "@/components/back-link"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { ClientForm, type ClientFormInitialValues } from "@/components/client-form"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { DetailList } from "@/components/detail-list"
import { EmptyState } from "@/components/empty-state"
import { ErrorNote } from "@/components/error-note"
import { Loading } from "@/components/loading"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import {
  type Client,
  useClient,
  useClients,
  useSaveClientDocuments,
  useUpdateClient,
} from "@/features/clients"
import {
  type CreditProposal,
  PROPOSAL_STATUS_LABELS,
  PROPOSAL_STATUS_TONES,
  proposalProductName,
  useClientProposals,
} from "@/features/proposals"
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  maskDocument,
  maskPhone,
  shortId,
} from "@/lib/format"
import { Can } from "@/lib/scopes"

type ClientTab = "overview" | "organization" | "proposals" | "network" | "documents"

import { ClientNetworkTab } from "./client-network-tab"

function toFormValues(client: Client): ClientFormInitialValues {
  return {
    id: client.id,
    person_type: client.personType as ClientFormInitialValues["person_type"],
    document_number: client.documentNumber,
    name: client.name,
    phone: client.phone,
    class_id: client.class?.id,
    subclass_id: client.subclass?.id,
    group_id: client.group?.id,
    subgroup_id: client.subgroup?.id,
    headquarters_id: client.headquarters,
    master_agent_id: client.masterAgent,
    bank_code: client.bankCode,
    agency: client.agency,
    account: client.account,
    account_digit: client.accountDigit,
    account_type: client.accountType,
  }
}

const proposalColumns: DataTableColumn<CreditProposal>[] = [
  {
    key: "externalKey",
    header: "Proposta",
    sortValue: (p) => p.externalKey ?? p.id,
    cell: (p) => <span className="font-mono text-xs">{p.externalKey ?? shortId(p.id)}</span>,
  },
  {
    key: "product",
    header: "Produto",
    sortValue: (p) => proposalProductName(p),
    cell: (p) => <span className="text-sm">{proposalProductName(p)}</span>,
  },
  {
    key: "amount",
    header: "Valor",
    align: "right",
    sortValue: (p) => Number(p.requestedAmount),
    cell: (p) => (
      <span className="font-medium tabular-nums text-foreground">
        {formatCurrency(p.requestedAmount)}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortValue: (p) => p.status,
    cell: (p) => (
      <StatusBadge tone={PROPOSAL_STATUS_TONES[p.status]}>
        {PROPOSAL_STATUS_LABELS[p.status]}
      </StatusBadge>
    ),
  },
  {
    key: "createdAt",
    header: "Criada em",
    sortValue: (p) => p.createdAt,
    cell: (p) => <span className="text-sm">{formatDateTime(p.createdAt)}</span>,
  },
]

export default function ClientDetailPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params)
  const router = useRouter()
  const { data: client, isLoading, error } = useClient(clientId)
  const { data: clients } = useClients()
  const { data: proposals } = useClientProposals(clientId)
  const updateClient = useUpdateClient()
  const saveDocuments = useSaveClientDocuments()

  const [activeTab, setActiveTab] = useState<ClientTab>("overview")

  if (isLoading) {
    return <Loading />
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Cliente não encontrado"
          breadcrumb={<BackLink href="/clients" label="Clientes" />}
        />
        <ErrorNote className="m-0">
          {error?.message ?? "Não foi possível carregar os dados do cliente."}
        </ErrorNote>
      </div>
    )
  }

  const isCorporate = client.personType === "CORPORATE"
  const isRepresentative =
    client.class?.code === "2" ||
    client.subclass?.code === "1.10" ||
    client.subclass?.code === "1.11"
  const hasNetwork =
    isCorporate ||
    isRepresentative ||
    (clients?.some((c) => c.headquarters === client.id || c.masterAgent === client.id) ?? false)

  const displayTabs = [
    { id: "overview" as ClientTab, label: "Visão geral" },
    { id: "organization" as ClientTab, label: "Organização" },
    ...(hasNetwork ? [{ id: "network" as ClientTab, label: "Rede / Parceiros" }] : []),
    { id: "proposals" as ClientTab, label: "Propostas" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/clients" label="Clientes" />}
        title={client.name}
        description={`${client.code} · ${maskDocument(client.documentNumber)}`}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge tone={client.isActive ? "success" : "muted"}>
              {client.isActive ? "Ativo" : "Inativo"}
            </StatusBadge>
            <Can scope="clients:update">
              {client.isActive ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    void updateClient.mutateAsync({ id: client.id, input: { is_active: false } })
                  }
                >
                  Desativar
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    void updateClient.mutateAsync({ id: client.id, input: { is_active: true } })
                  }
                >
                  Reativar
                </Button>
              )}
            </Can>
          </div>
        }
      />

      <div className="flex gap-4 border-b border-border">
        {displayTabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              "-mb-px border-b-2 border-transparent pb-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              activeTab === id && "border-foreground text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <Card.Header>
              <Card.Title>Identificação</Card.Title>
            </Card.Header>
            <Card.Content>
              <DetailList
                items={[
                  { label: "Código", value: client.code },
                  { label: "Nome", value: client.name },
                  { label: "Documento", value: maskDocument(client.documentNumber) },
                  { label: "Telefone", value: maskPhone(client.phone) },
                  { label: "Criado em", value: formatDate(client.createdAt) },
                ]}
              />
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Classificação</Card.Title>
            </Card.Header>
            <Card.Content>
              <DetailList
                items={[
                  {
                    label: "Tipo",
                    value: isCorporate
                      ? client.headquarters
                        ? "Pessoa Jurídica (Filial)"
                        : "Pessoa Jurídica (Matriz)"
                      : "Pessoa Física (Vendedor)",
                  },
                  {
                    label: "Classe",
                    value: client.class ? `${client.class.code} · ${client.class.name}` : "—",
                  },
                  {
                    label: "Subclasse",
                    value: client.subclass
                      ? `${client.subclass.code} · ${client.subclass.name}`
                      : "—",
                  },
                  {
                    label: "Grupo",
                    value: client.group ? `${client.group.code} · ${client.group.name}` : "—",
                  },
                  {
                    label: "Subgrupo",
                    value: client.subgroup
                      ? `${client.subgroup.code} · ${client.subgroup.name}`
                      : "—",
                  },
                ]}
              />
            </Card.Content>
          </Card>
        </div>
      )}

      {activeTab === "organization" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <Card.Header>
              <Card.Title>Contexto</Card.Title>
            </Card.Header>
            <Card.Content>
              {(() => {
                const hqClient = clients?.find((c) => c.id === client.headquarters)
                const agentClient = clients?.find((c) => c.id === client.masterAgent)
                return (
                  <DetailList
                    items={[
                      {
                        label: isCorporate ? "Matriz" : "Empresa / Filial",
                        value: hqClient
                          ? `${hqClient.code} · ${hqClient.name}`
                          : (client.headquarters ?? "—"),
                      },
                      {
                        label: "Representante / Master agent",
                        value: agentClient
                          ? `${agentClient.code} · ${agentClient.name}`
                          : (client.masterAgent ?? "—"),
                      },
                      ...(isCorporate
                        ? [
                            { label: "Banco", value: client.bankCode ?? "—" },
                            { label: "Agência", value: client.agency ?? "—" },
                            {
                              label: "Conta",
                              value: client.account
                                ? `${client.account}-${client.accountDigit ?? ""}`
                                : "—",
                            },
                            { label: "Tipo de conta", value: client.accountType ?? "—" },
                          ]
                        : []),
                    ]}
                  />
                )
              })()}
            </Card.Content>
          </Card>

          <Card className="lg:col-span-2">
            <Card.Header>
              <div>
                <Card.Title>Editar cadastro</Card.Title>
                <Card.Description>Alterar dados cadastrais do cliente.</Card.Description>
              </div>
            </Card.Header>
            <Card.Content>
              <ClientForm
                initialValues={toFormValues(client)}
                readOnlyFields={["person_type"]}
                submitLabel="Salvar alterações"
                submitting={updateClient.isPending}
                error={updateClient.isError ? updateClient.error.message : null}
                onSubmit={async (values) => {
                  await updateClient.mutateAsync({ id: client.id, input: values })
                }}
              />
            </Card.Content>
          </Card>
        </div>
      )}

      {activeTab === "network" && hasNetwork && (
        <div className="space-y-6">
          <ClientNetworkTab clientId={client.id} />
        </div>
      )}

      {activeTab === "proposals" && (
        <Card className="py-0">
          {proposals && proposals.length > 0 ? (
            <DataTable
              columns={proposalColumns}
              rows={proposals}
              getRowId={(proposal) => proposal.id}
              onRowClick={(proposal) => router.push(`/proposals/${proposal.id}`)}
              onEdit={(proposal) => router.push(`/proposals/${proposal.id}`)}
            />
          ) : (
            <EmptyState
              icon={<FileIcon className="size-5" />}
              title="Nenhuma proposta para este cliente"
              description="Quando houver propostas, elas aparecerão aqui."
            />
          )}
        </Card>
      )}

      {activeTab === "documents" && (
        <Card>
          <Card.Header>
            <Card.Title>Documentos (KYC)</Card.Title>
            <Card.Description>
              Envie a foto da frente e do verso do documento do cliente.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="grid gap-6 sm:grid-cols-2">
              <DocumentSlot
                label="Frente do documento"
                sourceUrl={client.frontDocumentUrl}
                uploadKey="front"
                upload={saveDocuments}
                clientId={clientId}
              />
              <DocumentSlot
                label="Verso do documento"
                sourceUrl={client.backDocumentUrl}
                uploadKey="back"
                upload={saveDocuments}
                clientId={clientId}
              />
            </div>
            {saveDocuments.isError ? (
              <p className="mt-4 text-sm text-destructive">{saveDocuments.error.message}</p>
            ) : null}
          </Card.Content>
        </Card>
      )}
    </div>
  )
}

function DocumentSlot({
  label,
  sourceUrl,
  uploadKey,
  upload,
  clientId,
}: {
  label: string
  sourceUrl: string | null
  uploadKey: "front" | "back"
  upload: ReturnType<typeof useSaveClientDocuments>
  clientId: string
}) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)

  return (
    <div className="space-y-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Ver arquivo atual
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">Nenhum arquivo enviado</span>
        )}
      </div>

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf"
        onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        className="block w-full text-sm text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground"
      />

      <Button
        variant="outline"
        size="sm"
        disabled={!file || upload.isPending}
        onClick={() =>
          void upload.mutate(
            { clientId, [uploadKey]: file as File, onUploadProgress: setProgress },
            {
              onSuccess: () => {
                setProgress(0)
                setFile(null)
              },
              onError: () => setProgress(0),
            },
          )
        }
      >
        {upload.isPending ? `Enviando... ${progress}%` : `Enviar ${label}`}
      </Button>
    </div>
  )
}
