"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { BackLink } from "@/components/back-link"
import { OperatorForm } from "@/components/operator-form"
import { PageHeader } from "@/components/page-header"
import type { OperatorSubmitValues } from "@/features/operators"
import { useCreateOperator } from "@/features/operators"

export default function NewOperatorPage() {
  const router = useRouter()
  const createOperator = useCreateOperator()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: OperatorSubmitValues) => {
    setError(null)
    try {
      const operator = await createOperator.mutateAsync(values)
      router.push(`/operators/${operator.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar o operador.")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/operators" label="Operadores" />}
        title="Novo operador"
        description="Cadastre um operador de banco para indicar nas propostas de crédito."
      />
      <div className="max-w-3xl">
        <OperatorForm
          submitLabel="Criar operador"
          submitting={createOperator.isPending}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
