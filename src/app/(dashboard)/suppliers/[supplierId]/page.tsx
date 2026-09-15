"use client"

import { Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useState } from "react"
import { BackLink } from "@/components/back-link"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { DetailList } from "@/components/detail-list"
import { ErrorNote } from "@/components/error-note"
import { Loading } from "@/components/loading"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { SupplierForm, type SupplierFormInitialValues } from "@/components/supplier-form"
import {
  type SupplierSubmitValues,
  useDeleteSupplier,
  useSupplierById,
  useUpdateSupplier,
} from "@/features/suppliers"
import { formatDate } from "@/lib/format"
import { Can } from "@/lib/scopes"

export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ supplierId: string }>
}) {
  const router = useRouter()
  const { supplierId } = use(params)
  const { data: supplier, isLoading, error } = useSupplierById(supplierId)
  const updateSupplier = useUpdateSupplier()
  const deleteSupplier = useDeleteSupplier()

  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading) {
    return <Loading />
  }

  if (!supplier) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Fornecedor não encontrado"
          description="O fornecedor pode ter sido desativado ou não existir mais."
          breadcrumb={<BackLink href="/suppliers" label="Fornecedores" />}
        />
        {error ? <ErrorNote className="m-0">{error.message}</ErrorNote> : null}
      </div>
    )
  }

  const handleSubmit = async (values: SupplierSubmitValues) => {
    setFormError(null)
    setSaved(false)
    try {
      await updateSupplier.mutateAsync({ id: supplier.id, input: values })
      setSaved(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Falha ao salvar o fornecedor.")
    }
  }

  const handleDelete = async () => {
    await deleteSupplier.mutateAsync(supplier.id)
    router.push("/suppliers")
  }

  const initialValues: SupplierFormInitialValues = {
    code: supplier.code,
    name: supplier.name,
    class_id: supplier.class?.id,
    subclass_id: supplier.subclass?.id,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/suppliers" label="Fornecedores" />}
        title={supplier.name}
        description={`${supplier.code} · Criado em ${formatDate(supplier.createdAt)}`}
        actions={
          <StatusBadge tone={supplier.isActive ? "success" : "muted"}>
            {supplier.isActive ? "Ativo" : "Inativo"}
          </StatusBadge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <Card.Header>
              <div>
                <Card.Title>Editar fornecedor</Card.Title>
                <Card.Description>Atualize os dados cadastrais do fornecedor.</Card.Description>
              </div>
              {saved ? <span className="text-sm text-success">Alterações salvas.</span> : null}
            </Card.Header>
            <Card.Content>
              <Can scope="suppliers:update" fallback={<SupplierReadOnly supplier={supplier} />}>
                <SupplierForm
                  initialValues={initialValues}
                  submitLabel="Salvar alterações"
                  submitting={updateSupplier.isPending}
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
                  { label: "Código", value: supplier.code },
                  { label: "Classe", value: supplier.class?.name ?? "—" },
                  { label: "Subclasse", value: supplier.subclass?.name ?? "—" },
                  { label: "Criado em", value: formatDate(supplier.createdAt) },
                ]}
              />
            </Card.Content>
          </Card>

          <Can scope="suppliers:delete">
            <Card>
              <Card.Header>
                <Card.Title className="text-destructive">Zona de perigo</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="mb-4 text-sm text-muted-foreground">
                  Desativar o fornecedor o oculta da lista e impede novos cadastros de produtos a
                  partir dele.
                </p>
                <Button
                  variant="destructive"
                  disabled={!supplier.isActive || deleteSupplier.isPending}
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2Icon />
                  Desativar fornecedor
                </Button>
              </Card.Content>
            </Card>
          </Can>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Desativar fornecedor?"
        description={`“${supplier.name}” deixará de aparecer nas listas e novos produtos não poderão ser criados para ele.`}
        confirmLabel="Desativar"
        destructive
        loading={deleteSupplier.isPending}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}

function SupplierReadOnly({ supplier }: { supplier: { code: string; name: string } }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">Código</p>
        <p className="font-mono text-sm text-foreground">{supplier.code}</p>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">Nome</p>
        <p className="text-sm text-foreground">{supplier.name}</p>
      </div>
    </div>
  )
}
