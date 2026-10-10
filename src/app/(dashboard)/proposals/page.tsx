"use client"

import { FilePlusIcon, FileTextIcon, SearchIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/button"
import { columnSortValues, DataTable, type DataTableColumn } from "@/components/data-table"
import { EmptyState } from "@/components/empty-state"
import { ErrorNote } from "@/components/error-note"
import { PageHeader } from "@/components/page-header"
import { Pagination } from "@/components/pagination"
import { Select } from "@/components/Select"
import { SearchInput } from "@/components/search-input"
import { StatusBadge } from "@/components/status-badge"
import { TablePanel } from "@/components/table-panel"
import { TableSkeleton } from "@/components/table-skeleton"
import {
  type CreditProposal,
  PROPOSAL_STATUS_LABELS,
  PROPOSAL_STATUS_TONES,
  type ProposalStatusEnum,
  proposalOperatorName,
  proposalProductName,
  useDeleteProposal,
  useProposals,
} from "@/features/proposals"
import { applyClientTable, useClientTableState } from "@/hooks/use-client-table.hook"
import { formatCurrency, formatDateTime, shortId } from "@/lib/format"
import { Can } from "@/lib/scopes"

const STATUS_FILTERS: Array<{ label: string; value: ProposalStatusEnum | "ALL" }> = [
  { label: "Todos", value: "ALL" },
  { label: "Pendente", value: "PENDING" },
  { label: "Em análise", value: "REVIEW" },
  { label: "Aprovado", value: "APPROVED" },
  { label: "Rejeitado", value: "REJECTED" },
  { label: "Cancelado", value: "CANCELLED" },
]

function useProposalColumns(): DataTableColumn<CreditProposal>[] {
  return [
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
}

export default function ProposalsPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<ProposalStatusEnum | "ALL">("ALL")
  const {
    data: proposals,
    isLoading,
    error,
  } = useProposals(statusFilter === "ALL" ? undefined : statusFilter)
  const deleteProposal = useDeleteProposal()
  const { state, setSearch, toggleSort, setPage } = useClientTableState({
    sortKey: "createdAt",
    sortDirection: "desc",
  })
  const columns = useProposalColumns()

  const items = proposals ?? []
  const { rows, totalItems, totalPages, page, pageSize } = applyClientTable({
    items,
    state,
    searchText: (proposal) =>
      [
        proposal.externalKey ?? "",
        proposal.id,
        proposal.client.name,
        proposal.client.documentNumber ?? "",
        proposalProductName(proposal),
        proposalOperatorName(proposal) ?? "",
      ].join(" "),
    getSortValue: columnSortValues(columns),
    defaultSortKey: "createdAt",
    pageSize: 12,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Propostas"
        description="Acompanhe e decida as propostas de crédito."
        actions={
          <Can scope="proposals:create">
            <Link href="/proposals/new">
              <Button>
                <FilePlusIcon />
                Nova proposta
              </Button>
            </Link>
          </Can>
        }
      />

      <TablePanel
        toolbar={
          <>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as ProposalStatusEnum | "ALL")
                setPage(1)
              }}
            >
              <Select.Trigger aria-label="Filtrar por status">
                <Select.Value>
                  {(value) =>
                    STATUS_FILTERS.find((filter) => filter.value === value)?.label ??
                    STATUS_FILTERS[0].label
                  }
                </Select.Value>
              </Select.Trigger>
              <Select.List>
                {STATUS_FILTERS.map(({ label, value }) => (
                  <Select.Item key={value} value={value}>
                    {label}
                  </Select.Item>
                ))}
              </Select.List>
            </Select>
            <SearchInput
              value={state.search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por cliente, produto ou proposta"
              containerClassName="w-full max-w-72 sm:ml-auto"
            />
          </>
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
          <TableSkeleton rows={12} />
        ) : error ? (
          <ErrorNote>Não foi possível carregar as propostas. {error.message}</ErrorNote>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<FileTextIcon className="size-5" />}
            title="Nenhuma proposta encontrada"
            description={
              statusFilter === "ALL"
                ? "Envie a primeira proposta para começar."
                : `Não há propostas com o status “${PROPOSAL_STATUS_LABELS[statusFilter]}”.`
            }
            actions={
              <Can scope="proposals:create">
                <Link href="/proposals/new">
                  <Button variant="outline">
                    <FilePlusIcon />
                    Nova proposta
                  </Button>
                </Link>
              </Can>
            }
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="size-5" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos propostas para “${state.search}”.`}
          />
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(proposal) => proposal.id}
            onRowClick={(proposal) => router.push(`/proposals/${proposal.id}`)}
            onEdit={(proposal) => router.push(`/proposals/${proposal.id}`)}
            onDelete={async (proposal) => {
              await deleteProposal.mutateAsync(proposal.id)
            }}
            deleteConfirmTitle={(proposal) =>
              `Excluir proposta ${proposal.externalKey ?? proposal.id.slice(0, 8)}?`
            }
            deleteConfirmDescription="Tem certeza de que deseja excluir esta proposta de crédito? Esta ação não pode ser desfeita."
            sortKey={state.sortKey}
            sortDirection={state.sortDirection}
            onSortChange={(column) => toggleSort(column.key)}
          />
        )}
      </TablePanel>
    </div>
  )
}
