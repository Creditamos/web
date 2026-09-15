"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { BackLink } from "@/components/back-link"
import { PageHeader } from "@/components/page-header"
import { UserForm, type UserSubmitValues } from "@/components/user-form"
import { type CreateUserInput, useCreateUser } from "@/features/users"

export default function NewUserPage() {
  const router = useRouter()
  const createUser = useCreateUser()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: UserSubmitValues) => {
    if (!values.password) {
      setError("A senha é obrigatória na criação do usuário.")
      return
    }
    setError(null)
    try {
      const input: CreateUserInput = {
        name: values.name,
        email: values.email,
        password: values.password,
        role_ids: values.role_ids,
      }
      const user = await createUser.mutateAsync(input)
      router.push(`/users/${user.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar o usuário.")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/users" label="Usuários" />}
        title="Novo usuário"
        description="Crie uma conta de acesso ao painel com os perfis desejados."
      />
      <div className="max-w-3xl">
        <UserForm
          submitLabel="Criar usuário"
          submitting={createUser.isPending}
          error={error}
          passwordRequired
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
