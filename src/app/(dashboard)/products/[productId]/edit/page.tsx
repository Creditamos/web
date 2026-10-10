"use client"

import { useRouter } from "next/navigation"
import { use, useState } from "react"
import { BackLink } from "@/components/back-link"
import { ErrorNote } from "@/components/error-note"
import { Loading } from "@/components/loading"
import { PageHeader } from "@/components/page-header"
import { ProductForm } from "@/components/product-form"
import { type CreateProductInput, useProductById, useUpdateProduct } from "@/features/products"

export default function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const router = useRouter()
  const { productId } = use(params)
  const { data: product, isLoading, error } = useProductById(productId)
  const updateProduct = useUpdateProduct()
  const [formError, setFormError] = useState<string | null>(null)

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

  const handleSubmit = async (values: CreateProductInput) => {
    setFormError(null)
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        input: values,
      })
      router.push(`/products/${product.id}`)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Falha ao salvar o produto.")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href={`/products/${product.id}`} label={product.name} />}
        title={`Editar produto: ${product.name}`}
        description={`${product.code} · Atualize as configurações e informações da linha de crédito.`}
      />
      <div className="max-w-3xl">
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
      </div>
    </div>
  )
}
