"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { BackLink } from "@/components/back-link"
import { PageHeader } from "@/components/page-header"
import { RoleForm, type RoleSubmitValues } from "@/components/role-form"
import { useCreateRole } from "@/features/roles"

export default function NewRolePage() {
  const router = useRouter()
  const createRole = useCreateRole()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: RoleSubmitValues) => {
    setError(null)
    try {
      const role = await createRole.mutateAsync(values)
      router.push(`/roles/${role.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar a role.")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/roles" label="Perfis & Acessos" />}
        title="Nova role"
        description="Defina um perfil de acesso combinando permissões (scopes)."
      />
      <div className="max-w-3xl">
        <RoleForm
          submitLabel="Criar role"
          submitting={createRole.isPending}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
