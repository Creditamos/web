"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { BackLink } from "@/components/back-link"
import { PageHeader } from "@/components/page-header"
import { SupplierForm } from "@/components/supplier-form"
import { type SupplierSubmitValues, useCreateSupplier } from "@/features/suppliers"

export default function NewSupplierPage() {
  const router = useRouter()
  const createSupplier = useCreateSupplier()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: SupplierSubmitValues) => {
    setError(null)
    try {
      const supplier = await createSupplier.mutateAsync(values)
      router.push(`/suppliers/${supplier.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar o fornecedor.")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/suppliers" label="Fornecedores" />}
        title="Novo fornecedor"
        description="Cadastre uma instituição parceira que origina produtos de crédito."
      />
      <div className="max-w-3xl">
        <SupplierForm
          submitLabel="Criar fornecedor"
          submitting={createSupplier.isPending}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
