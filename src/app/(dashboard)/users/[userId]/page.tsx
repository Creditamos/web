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
import { UserForm, type UserSubmitValues } from "@/components/user-form"
import { useDeleteUser, useUpdateUser, useUserById } from "@/features/users"
import { formatDate } from "@/lib/format"
import { Can } from "@/lib/scopes"
import { useAuth } from "@/providers/auth.provider"

export default function UserDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const router = useRouter()
  const { admin } = useAuth()
  const { userId } = use(params)
  const { data: user, isLoading, error } = useUserById(userId)
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Usuário não encontrado"
          description="O usuário pode ter sido desativado ou não existir mais."
          breadcrumb={<BackLink href="/users" label="Usuários" />}
        />
        {error ? <ErrorNote className="m-0">{error.message}</ErrorNote> : null}
      </div>
    )
  }

  const isSelf = admin?.id === user.id

  const handleSubmit = async (values: UserSubmitValues) => {
    setFormError(null)
    setSaved(false)
    try {
      await updateUser.mutateAsync({ id: user.id, input: values })
      setSaved(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Falha ao salvar o usuário.")
    }
  }

  const handleDeactivate = async () => {
    await deleteUser.mutateAsync(user.id)
    router.push("/users")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/users" label="Usuários" />}
        title={user.name}
        description={`${user.email}${isSelf ? " · esta é a sua conta" : ""}`}
        actions={
          <StatusBadge tone={user.isActive ? "success" : "muted"}>
            {user.isActive ? "Ativo" : "Inativo"}
          </StatusBadge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <Card.Header>
              <div>
                <Card.Title>Editar usuário</Card.Title>
                <Card.Description>Atualize os dados de acesso do usuário.</Card.Description>
              </div>
              {saved ? <span className="text-sm text-success">Alterações salvas.</span> : null}
            </Card.Header>
            <Card.Content>
              <UserForm
                initialValues={{
                  name: user.name,
                  email: user.email,
                  role_ids: user.roleIds,
                }}
                submitLabel="Salvar alterações"
                submitting={updateUser.isPending}
                error={formError}
                rolesLocked={isSelf}
                onSubmit={handleSubmit}
              />
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
                  { label: "Nome", value: user.name },
                  { label: "E-mail", value: user.email },
                  {
                    label: "Perfis",
                    value: user.roleNames.length > 0 ? user.roleNames.join(" · ") : "—",
                  },
                  {
                    label: "Último acesso",
                    value: user.lastLoginAt ? formatDate(user.lastLoginAt) : "Nunca",
                  },
                  { label: "Criado em", value: formatDate(user.createdAt) },
                ]}
              />
            </Card.Content>
          </Card>

          <Can scope="users:delete">
            <Card>
              <Card.Header>
                <Card.Title className="text-destructive">Zona de perigo</Card.Title>
              </Card.Header>
              <Card.Content>
                <p className="mb-4 text-sm text-muted-foreground">
                  Desativar o usuário revoga o acesso ao painel imediatamente.
                </p>
                <Button
                  variant="destructive"
                  disabled={!user.isActive || isSelf || deleteUser.isPending}
                  onClick={() => setConfirmOpen(true)}
                >
                  <Trash2Icon />
                  Desativar usuário
                </Button>
              </Card.Content>
            </Card>
          </Can>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Desativar usuário?"
        description={`“${user.name}” perderá o acesso ao painel imediatamente.`}
        confirmLabel="Desativar"
        destructive
        loading={deleteUser.isPending}
        onConfirm={() => void handleDeactivate()}
      />
    </div>
  )
}
