"use client"

import { TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import { BackLink } from "@/components/back-link"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { DetailList } from "@/components/detail-list"
import { ErrorNote } from "@/components/error-note"
import { Label } from "@/components/label"
import { Loading } from "@/components/loading"
import { PageHeader } from "@/components/page-header"
import { NativeSelect } from "@/components/select-native"
import { StatusBadge } from "@/components/status-badge"
import { useOperators } from "@/features/operators"
import {
  PROPOSAL_STATUS_LABELS,
  PROPOSAL_STATUS_TONES,
  PROPOSAL_TRANSITION_LABELS,
  PROPOSAL_TRANSITIONS,
  type ProposalStatusEnum,
  proposalOperatorName,
  proposalProductName,
  proposalSupplierName,
  proposalTransitionScope,
  useDeleteProposal,
  useProposal,
  useUpdateProposalOperator,
  useUpdateProposalStatus,
} from "@/features/proposals"
import { formatCurrency, formatDateTime, maskDocument, maskPhone, shortId } from "@/lib/format"
import { Can } from "@/lib/scopes"

function confirmDescription(next: ProposalStatusEnum): string {
  switch (next) {
    case "APPROVED":
      return "A proposta será aprovada e o limite liberado ficará disponível."
    case "REJECTED":
      return "A proposta será rejeitada. Essa ação não poderá ser revertida."
    case "CANCELLED":
      return "A proposta será cancelada. Essa ação não poderá ser revertida."
    default:
      return "A proposta seguirá para o próximo estágio do fluxo."
  }
}

export default function ProposalDetailPage({
  params,
}: {
  params: Promise<{ proposalId: string }>
}) {
  const { proposalId } = use(params)
  const router = useRouter()
  const { data: proposal, isLoading, error } = useProposal(proposalId)
  const updateStatus = useUpdateProposalStatus()
  const deleteProposal = useDeleteProposal()

  const [pendingTransition, setPendingTransition] = useState<ProposalStatusEnum | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  if (isLoading) {
    return <Loading />
  }

  if (error || !proposal) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Proposta não encontrada"
          breadcrumb={<BackLink href="/proposals" label="Propostas" />}
        />
        <ErrorNote className="m-0">
          {error?.message ?? "Não foi possível carregar a proposta."}
        </ErrorNote>
      </div>
    )
  }

  const transitions = PROPOSAL_TRANSITIONS[proposal.status]

  const runTransition = async (next: ProposalStatusEnum) => {
    setStatusError(null)
    try {
      await updateStatus.mutateAsync({ id: proposal.id, status: next })
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "Falha ao atualizar o status.")
    }
  }

  const handleDelete = async () => {
    await deleteProposal.mutateAsync(proposal.id)
    router.push("/proposals")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/proposals" label="Propostas" />}
        title={
          proposal.externalKey ?? <span className="font-mono">{shortId(proposal.id, 12)}</span>
        }
        description={`Criada em ${formatDateTime(proposal.createdAt)}`}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge tone={PROPOSAL_STATUS_TONES[proposal.status]}>
              {PROPOSAL_STATUS_LABELS[proposal.status]}
            </StatusBadge>
            <Can scope="proposals:update">
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(true)}>
                <TrashIcon />
                Excluir
              </Button>
            </Can>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <Card.Header>
            <Card.Title>Valores</Card.Title>
          </Card.Header>
          <Card.Content>
            <DetailList
              items={[
                { label: "Valor solicitado", value: formatCurrency(proposal.requestedAmount) },
                { label: "Limite pré-aprovado", value: formatCurrency(proposal.preApprovedLimit) },
                { label: "Atualizada em", value: formatDateTime(proposal.updatedAt) },
              ]}
            />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Envolvidos</Card.Title>
          </Card.Header>
          <Card.Content>
            <DetailList
              items={[
                { label: "Cliente", value: proposal.client.name },
                { label: "Documento", value: maskDocument(proposal.client.documentNumber ?? "") },
                { label: "Telefone", value: maskPhone(proposal.client.phone ?? "") },
                { label: "Produto", value: proposalProductName(proposal) },
                { label: "Fornecedor", value: proposalSupplierName(proposal) ?? "—" },
                { label: "Operador", value: proposalOperatorName(proposal) ?? "—" },
              ]}
            />
            <Can scope="proposals:update">
              <OperatorAssign proposalId={proposal.id} operatorId={proposal.operator?.id ?? null} />
            </Can>
          </Card.Content>
        </Card>
      </div>

      <Card>
        <Card.Header>
          <div>
            <Card.Title>Fluxo da proposta</Card.Title>
            <Card.Description>
              Aprove, rejeite ou avance o status da proposta seguindo o fluxo da operação.
            </Card.Description>
          </div>
        </Card.Header>
        <Card.Content>
          {transitions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {transitions.map((next) => (
                <Can key={next} scope={proposalTransitionScope(next)}>
                  <Button
                    variant={
                      next === "APPROVED"
                        ? "default"
                        : next === "REJECTED"
                          ? "destructive"
                          : "outline"
                    }
                    onClick={() => setPendingTransition(next)}
                    disabled={updateStatus.isPending}
                  >
                    {PROPOSAL_TRANSITION_LABELS[next] ?? next}
                  </Button>
                </Can>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Esta proposta está em um estado final e não admite novas transições.
            </p>
          )}

          {statusError ? <p className="mt-3 text-sm text-destructive">{statusError}</p> : null}
        </Card.Content>
      </Card>

      <ConfirmDialog
        open={pendingTransition !== null}
        title={pendingTransition ? `Confirmar: ${PROPOSAL_STATUS_LABELS[pendingTransition]}` : ""}
        description={pendingTransition ? confirmDescription(pendingTransition) : ""}
        confirmLabel={
          pendingTransition === "APPROVED"
            ? "Aprovar proposta"
            : pendingTransition === "REJECTED"
              ? "Rejeitar proposta"
              : pendingTransition === "CANCELLED"
                ? "Cancelar proposta"
                : "Confirmar"
        }
        destructive={pendingTransition === "REJECTED" || pendingTransition === "CANCELLED"}
        loading={updateStatus.isPending}
        onConfirm={() => pendingTransition && runTransition(pendingTransition)}
        onOpenChange={() => setPendingTransition(null)}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Excluir proposta"
        description="A proposta será removida definitivamente. Essa ação não pode ser desfeita."
        confirmLabel="Excluir definitivamente"
        destructive
        loading={deleteProposal.isPending}
        onConfirm={handleDelete}
        onOpenChange={setConfirmDelete}
      />
    </div>
  )
}

function OperatorAssign({
  proposalId,
  operatorId,
}: {
  proposalId: string
  operatorId: string | null
}) {
  const { data: operators } = useOperators(true)
  const updateOperator = useUpdateProposalOperator()
  const [assignError, setAssignError] = useState<string | null>(null)

  const handleChange = async (value: string) => {
    setAssignError(null)
    try {
      await updateOperator.mutateAsync({ id: proposalId, operator_id: value || null })
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : "Falha ao atualizar o operador.")
    }
  }

  return (
    <div className="mt-4 space-y-2 border-t border-border pt-4">
      <Label htmlFor="proposal-operator">Operador responsável</Label>
      <NativeSelect
        id="proposal-operator"
        value={operatorId ?? ""}
        onChange={(e) => void handleChange(e.target.value)}
        disabled={updateOperator.isPending}
      >
        <option value="">Sem operador</option>
        {operators?.map((operator) => (
          <option key={operator.id} value={operator.id}>
            {operator.fullName} ({operator.code})
          </option>
        ))}
      </NativeSelect>
      {updateOperator.isPending ? (
        <p className="text-xs text-muted-foreground">Salvando...</p>
      ) : null}
      {assignError ? <p className="text-xs text-destructive">{assignError}</p> : null}
    </div>
  )
}
