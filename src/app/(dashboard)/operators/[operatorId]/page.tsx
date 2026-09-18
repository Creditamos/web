"use client"

import { Trash2Icon } from "lucide-react"
import { use, useState } from "react"
import { BackLink } from "@/components/back-link"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { DetailList } from "@/components/detail-list"
import { ErrorNote } from "@/components/error-note"
import { Loading } from "@/components/loading"
import { OperatorForm, type OperatorFormInitialValues } from "@/components/operator-form"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import {
  type OperatorSubmitValues,
  useDeleteOperator,
  useOperatorById,
  useReactivateOperator,
  useUpdateOperator,
} from "@/features/operators"
import { formatDate, maskDocument, maskPhone } from "@/lib/format"
import { Can } from "@/lib/scopes"

export default function OperatorDetailPage({
  params,
}: {
  params: Promise<{ operatorId: string }>
}) {
  const { operatorId } = use(params)
  const { data: operator, isLoading, error } = useOperatorById(operatorId)
  const updateOperator = useUpdateOperator()
  const deleteOperator = useDeleteOperator()
  const reactivateOperator = useReactivateOperator()

  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading) {
    return <Loading />
  }

  if (!operator) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Operador não encontrado"
          description="O operador pode ter sido desativado ou não existir mais."
          breadcrumb={<BackLink href="/operators" label="Operadores" />}
        />
        {error ? <ErrorNote className="m-0">{error.message}</ErrorNote> : null}
      </div>
    )
  }

  const handleSubmit = async (values: OperatorSubmitValues) => {
    setFormError(null)
    setSaved(false)
    try {
      await updateOperator.mutateAsync({ id: operator.id, input: values })
      setSaved(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Falha ao salvar o operador.")
    }
  }

  const handleDeactivate = async () => {
    await deleteOperator.mutateAsync(operator.id)
    setConfirmOpen(false)
  }

  const handleReactivate = async () => {
    await reactivateOperator.mutateAsync(operator.id)
  }

  const initialValues: OperatorFormInitialValues = {
    supplier_id: operator.supplier?.id,
    code: operator.code,
    full_name: operator.fullName,
    cpf: operator.cpf,
    phone: operator.phone ?? "",
    email: operator.email ?? "",
    rg: operator.rg ?? "",
    birth_date: operator.birthDate?.slice(0, 10) ?? "",
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/operators" label="Operadores" />}
        title={operator.fullName}
        description={`${operator.code} · Criado em ${formatDate(operator.createdAt)}`}
        actions={
          <StatusBadge tone={operator.isActive ? "success" : "muted"}>
            {operator.isActive ? "Ativo" : "Inativo"}
          </StatusBadge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <Card.Header>
              <div>
                <Card.Title>Editar operador</Card.Title>
                <Card.Description>Atualize os dados cadastrais do operador.</Card.Description>
              </div>
              {saved ? <span className="text-sm text-success">Alterações salvas.</span> : null}
            </Card.Header>
            <Card.Content>
              <Can scope="operators:update" fallback={<OperatorReadOnly operator={operator} />}>
                <OperatorForm
                  initialValues={initialValues}
                  submitLabel="Salvar alterações"
                  submitting={updateOperator.isPending}
                  error={formError}
                  onSubmit={handleSubmit}
                />
              </Can>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Informações</Card.Title>
            </Card.Header>
            <Card.Content>
              <DetailList
                items={[
                  {
                    label: "Banco",
                    value: `${operator.supplier?.code ?? ""} ${operator.supplier?.name ?? "—"}`,
                  },
                  { label: "CPF", value: maskDocument(operator.cpf) },
                  { label: "RG", value: operator.rg ?? "—" },
                  { label: "Nascimento", value: formatDate(operator.birthDate) },
                  { label: "Telefone", value: operator.phone ? maskPhone(operator.phone) : "—" },
                  { label: "E-mail", value: operator.email ?? "—" },
                  { label: "Criado em", value: formatDate(operator.createdAt) },
                ]}
              />
            </Card.Content>
          </Card>

          <Can scope="operators:delete">
            <Card>
              <Card.Header>
                <Card.Title className="text-destructive">Zona de perigo</Card.Title>
              </Card.Header>
              <Card.Content>
                {operator.isActive ? (
                  <>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Desativar o operador o oculta da lista e impede que novas propostas sejam
                      vinculadas a ele.
                    </p>
                    <Button
                      variant="destructive"
                      disabled={deleteOperator.isPending}
                      onClick={() => setConfirmOpen(true)}
                    >
                      <Trash2Icon />
                      Desativar operador
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Reativar o operador o torna disponível novamente para vínculo em propostas.
                    </p>
                    <Button
                      variant="default"
                      disabled={reactivateOperator.isPending}
                      onClick={() => void handleReactivate()}
                    >
                      Reativar operador
                    </Button>
                  </>
                )}
              </Card.Content>
            </Card>
          </Can>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Desativar operador?"
        description={`“${operator.fullName}” deixará de aparecer nas listas e novas propostas não poderão ser vinculadas a ele.`}
        confirmLabel="Desativar"
        destructive
        loading={deleteOperator.isPending}
        onConfirm={() => void handleDeactivate()}
      />
    </div>
  )
}

function OperatorReadOnly({ operator }: { operator: { code: string; fullName: string } }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">Código</p>
        <p className="font-mono text-sm text-foreground">{operator.code}</p>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">Nome</p>
        <p className="text-sm text-foreground">{operator.fullName}</p>
      </div>
    </div>
  )
}
