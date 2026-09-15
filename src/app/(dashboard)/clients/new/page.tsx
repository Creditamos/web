"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { BackLink } from "@/components/back-link"
import { ClientForm, type ClientSubmitValues } from "@/components/client-form"
import { PageHeader } from "@/components/page-header"
import { useCreateClient } from "@/features/clients"

export default function NewClientPage() {
  const router = useRouter()
  const createClient = useCreateClient()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: ClientSubmitValues) => {
    setError(null)
    try {
      const client = await createClient.mutateAsync(values)
      router.push(`/clients/${client.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar o cliente.")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/clients" label="Clientes" />}
        title="Novo cliente"
        description="Preencha os dados cadastrais para incluir o cliente na carteira."
      />
      <div className="max-w-3xl">
        <ClientForm
          submitLabel="Criar cliente"
          submitting={createClient.isPending}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
