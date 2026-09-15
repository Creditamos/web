"use client"

import { ArrowRightIcon, FileTextIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { JSX } from "react"
import { Button } from "@/components/button"
import { DataTable, type DataTableColumn } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { TablePanel } from "@/components/table-panel"
import { TableSkeleton } from "@/components/table-skeleton"
import { WhatsappStatusCard } from "@/components/whatsapp-status-card"
import { useClients } from "@/features/clients"
import {
  type CreditProposal,
  PROPOSAL_STATUS_LABELS,
  PROPOSAL_STATUS_TONES,
  proposalOperatorName,
  proposalProductName,
  useProposals,
} from "@/features/proposals"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { Can } from "@/lib/scopes"

interface StatItem {
  label: string
  value: string
  sub?: string
}

const recentProposalColumns: DataTableColumn<CreditProposal>[] = [
  {
    key: "externalKey",
    header: "Proposta",
    sortValue: (p) => p.externalKey ?? p.id,
    cell: (p) => (
      <span className="font-mono text-xs text-foreground">{p.externalKey ?? shortId(p.id)}</span>
    ),
  },
  {
    key: "client",
    header: "Cliente",
    sortValue: (p) => p.client.name,
    cell: (p) => <span className="font-medium text-foreground">{p.client.name}</span>,
  },
  {
    key: "product",
    header: "Produto",
    sortValue: (p) => proposalProductName(p),
    cell: (p) => (
      <span className="text-sm">
        {proposalProductName(p)}
        {proposalOperatorName(p) ? ` · ${proposalOperatorName(p)}` : ""}
      </span>
    ),
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

export default function DashboardPage(): JSX.Element {
  const router = useRouter()
  const { data: clients, isLoading: clientsLoading } = useClients()
  const { data: proposals, isLoading: proposalsLoading } = useProposals()

  const activeClients = clients?.filter((client) => client.isActive).length ?? 0
  const approved = proposals?.filter((proposal) => proposal.status === "APPROVED") ?? []
  const approvedLimit = approved.reduce(
    (sum: number, proposal: CreditProposal) => sum + Number(proposal.requestedAmount),
    0,
  )
  const pending = proposals?.filter((proposal) => proposal.status === "PENDING").length ?? 0
  const recentProposals = proposals?.slice(0, 6) ?? []

  const stats: StatItem[] = [
    {
      label: "Propostas",
      value: proposalsLoading ? "—" : String(proposals?.length ?? 0),
      sub: "enviadas na operação",
    },
    {
      label: "Clientes ativos",
      value: clientsLoading ? "—" : String(activeClients),
      sub: `de ${clients?.length ?? 0} na carteira`,
    },
    {
      label: "Limite aprovado",
      value: proposalsLoading ? "—" : formatCurrency(approvedLimit),
      sub: `${approved.length} propostas aprovadas`,
    },
    {
      label: "Pendências",
      value: proposalsLoading ? "—" : String(pending),
      sub: "aguardando decisão",
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Painel"
        description="Visão geral das operações de crédito."
        actions={
          <Can scope="proposals:create">
            <Link href="/proposals/new">
              <Button>
                <FileTextIcon />
                Nova proposta
              </Button>
            </Link>
          </Can>
        }
      />

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-border pb-6 sm:flex sm:gap-x-0 sm:divide-x sm:divide-border">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-0.5 sm:px-6 sm:first:pl-0 sm:last:pr-6">
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
              {stat.value}
            </p>
            {stat.sub ? <p className="text-xs text-muted-foreground">{stat.sub}</p> : null}
          </div>
        ))}
      </div>

      <WhatsappStatusCard />

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-foreground">Propostas recentes</h2>
          <Link
            href="/proposals"
            className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver todas
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>

        <TablePanel>
          {proposalsLoading ? (
            <TableSkeleton rows={6} />
          ) : recentProposals.length === 0 ? (
            <EmptyState
              icon={<FileTextIcon className="size-5" />}
              title="Nenhuma proposta cadastrada"
              description="As propostas enviadas pelos clientes aparecerão aqui."
            />
          ) : (
            <DataTable
              columns={recentProposalColumns}
              rows={recentProposals}
              getRowId={(proposal) => proposal.id}
              onRowClick={(proposal) => router.push(`/proposals/${proposal.id}`)}
            />
          )}
        </TablePanel>
      </section>
    </div>
  )
}
