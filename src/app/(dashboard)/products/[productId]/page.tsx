"use client"

import { use } from "react"
import { BackLink } from "@/components/back-link"
import { Card } from "@/components/Card"
import { DetailList } from "@/components/detail-list"
import { ErrorNote } from "@/components/error-note"
import { Loading } from "@/components/loading"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { useProductById } from "@/features/products"
import { formatDate } from "@/lib/format"

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params)
  const { data: product, isLoading, error } = useProductById(productId)

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

  const audience = product.clientTypes.includes("CORPORATE")
    ? product.clientTypes.includes("INDIVIDUAL")
      ? "Pessoa física e pessoa jurídica"
      : "Pessoa jurídica"
    : "Pessoa física"

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/products" label="Produtos" />}
        title={product.name}
        description={`${product.code} · ${product.supplier ?? "Sem fornecedor"}`}
        actions={
          <StatusBadge tone={product.isActive ? "success" : "muted"}>
            {product.isActive ? "Ativo" : "Inativo"}
          </StatusBadge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title>Informações</Card.Title>
          </Card.Header>
          <Card.Content>
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
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
