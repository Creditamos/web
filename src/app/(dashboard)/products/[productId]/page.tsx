"use client"

import { PencilIcon, Trash2Icon } from "lucide-react"
import Link from "next/link"
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
import { ProductForm } from "@/components/product-form"
import { StatusBadge } from "@/components/status-badge"
import {
  type CreateProductInput,
  useDeleteProduct,
  useProductById,
  useUpdateProduct,
} from "@/features/products"
import { formatDate } from "@/lib/format"
import { Can } from "@/lib/scopes"

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const router = useRouter()
  const { productId } = use(params)
  const { data: product, isLoading, error } = useProductById(productId)
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()

  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading) {
    return <Loading />
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Produto não encontrado"
          description="O produto pode ter sido desativado ou não existir mais."
          breadcrumb={<BackLink href="/products" label="Produtos" />}
        />
        {error ? <ErrorNote className="m-0">{error.message}</ErrorNote> : null}
      </div>
    )
  }

  const audience =
    product.clientTypes.includes("CORPORATE") && product.clientTypes.includes("INDIVIDUAL")
      ? "Pessoa física e pessoa jurídica"
      : product.clientTypes.includes("CORPORATE")
        ? "Pessoa jurídica"
        : "Pessoa física"

  const handleSubmit = async (values: CreateProductInput) => {
    setFormError(null)
    setSaved(false)
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        input: values,
      })
      setSaved(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Falha ao salvar o produto.")
    }
  }

  const handleDeactivate = async () => {
    await deleteProduct.mutateAsync(product.id)
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/products" label="Produtos" />}
        title={product.name}
        description={`${product.code} · ${product.supplier ?? "Sem fornecedor"}`}
        actions={
          <div className="flex items-center gap-3">
            <StatusBadge tone={product.isActive ? "success" : "muted"}>
              {product.isActive ? "Ativo" : "Inativo"}
            </StatusBadge>
            <Can scope="products:update">
              <Link href={`/products/${product.id}/edit`}>
                <Button variant="outline" size="sm">
                  <PencilIcon />
                  Editar produto
                </Button>
              </Link>
            </Can>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <Card.Header>
              <div>
                <Card.Title>Editar produto</Card.Title>
                <Card.Description>Atualize os dados e configurações do produto.</Card.Description>
              </div>
              {saved ? <span className="text-sm text-success">Alterações salvas.</span> : null}
            </Card.Header>
            <Card.Content>
              <Can
                scope="products:update"
                fallback={
                  <DetailList
                    items={[
                      { label: "Código", value: product.code },
                      { label: "Nome", value: product.name },
                      { label: "Fornecedor", value: product.supplier ?? "—" },
                      { label: "Classe", value: product.class ?? "—" },
                      { label: "Subclasse", value: product.subclass ?? "—" },
                      { label: "Público-alvo", value: audience },
                      { label: "Criado em", value: formatDate(product.createdAt) },
                    ]}
                  />
                }
              >
                <ProductForm
                  initialValues={{
                    id: product.id,
                    code: product.code,
                    name: product.name,
                    supplier_id: product.supplierId,
                    class_id: product.classId,
                    subclass_id: product.subclassId,
                    client_types: product.clientTypes,
                  }}
                  submitLabel="Salvar alterações"
                  submitting={updateProduct.isPending}
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
              <Card.Title>Informações gerais</Card.Title>
            </Card.Header>
            <Card.Content>
              <DetailList
                items={[
                  { label: "Código", value: product.code },
                  { label: "Fornecedor", value: product.supplier ?? "—" },
                  { label: "Classe", value: product.class ?? "—" },
                  { label: "Subclasse", value: product.subclass ?? "—" },
                  { label: "Público-alvo", value: audience },
                  { label: "Criado em", value: formatDate(product.createdAt) },
                ]}
              />
            </Card.Content>
          </Card>

          <Can scope="products:delete">
            <Card>
              <Card.Header>
                <Card.Title className="text-destructive">Zona de perigo</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="mb-4 text-sm text-muted-foreground">
                  Desativar o produto impede novas contratações e propostas com esta linha de
                  crédito.
                </p>
                <Button
                  variant="destructive"
                  disabled={!product.isActive || deleteProduct.isPending}
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2Icon />
                  Desativar produto
                </Button>
              </Card.Content>
            </Card>
          </Can>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Desativar produto?"
        description={`“${product.name}” deixará de estar ativo para seleção em propostas.`}
        confirmLabel="Desativar"
        destructive
        loading={deleteProduct.isPending}
        onConfirm={handleDeactivate}
      />
    </div>
  )
}
