"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { BackLink } from "@/components/back-link"
import { PageHeader } from "@/components/page-header"
import { ProductForm } from "@/components/product-form"
import { type CreateProductInput, useCreateProduct } from "@/features/products"

export default function NewProductPage() {
  const router = useRouter()
  const createProduct = useCreateProduct()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: CreateProductInput) => {
    setError(null)
    try {
      const product = await createProduct.mutateAsync(values)
      router.push(`/products/${product.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar o produto.")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/products" label="Produtos" />}
        title="Novo produto"
        description="Cadastre um produto de crédito associado a um fornecedor/banco parceiro."
      />
      <div className="max-w-3xl">
        <ProductForm
          submitLabel="Criar produto"
          submitting={createProduct.isPending}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
