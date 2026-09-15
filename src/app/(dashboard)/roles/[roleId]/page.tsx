"use client"

import { LockIcon, Trash2Icon } from "lucide-react"
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
import { RoleForm, type RoleFormInitialValues, type RoleSubmitValues } from "@/components/role-form"
import { StatusBadge } from "@/components/status-badge"
import { useDeleteRole, useRoleById, useUpdateRole } from "@/features/roles"
import { formatDate } from "@/lib/format"
import { Can } from "@/lib/scopes"

const PROTECTED_NAMES = new Set(["SUPER_ADMIN"])

export default function RoleDetailPage({ params }: { params: Promise<{ roleId: string }> }) {
  const router = useRouter()
  const { roleId } = use(params)
  const { data: role, isLoading, error } = useRoleById(roleId)
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()

  const [formError, setFormError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (isLoading) {
    return <Loading />
  }

  if (!role) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Role não encontrada"
          description="A role pode ter sido desativada ou não existir mais."
          breadcrumb={<BackLink href="/roles" label="Perfis & Acessos" />}
        />
        {error ? <ErrorNote className="m-0">{error.message}</ErrorNote> : null}
      </div>
    )
  }

  const isProtected = PROTECTED_NAMES.has(role.name)

  const handleSubmit = async (values: RoleSubmitValues) => {
    setFormError(null)
    setSaved(false)
    try {
      await updateRole.mutateAsync({ id: role.id, input: values })
      setSaved(true)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Falha ao salvar a role.")
    }
  }

  const handleDeactivate = async () => {
    await deleteRole.mutateAsync(role.id)
    router.push("/roles")
  }

  const initialValues: RoleFormInitialValues = {
    name: role.name,
    description: role.description,
    scope_ids: role.scopes.map((scope) => scope.id),
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/roles" label="Perfis & Acessos" />}
        title={<span className="font-mono">{role.name}</span>}
        description={`${role.userCount} usuário${role.userCount === 1 ? "" : "s"} · Criada em ${formatDate(role.createdAt)}`}
        actions={
          <StatusBadge tone={role.isActive ? "success" : "muted"}>
            {role.isActive ? "Ativa" : "Inativa"}
          </StatusBadge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <Card.Header>
              <div>
                <Card.Title>Editar role</Card.Title>
                <Card.Description>
                  {isProtected
                    ? "Role protegida — não é possível alterar nome, permissões ou status."
                    : "Configure o nome, a descrição e as permissões da role."}
                </Card.Description>
              </div>
              {saved ? <span className="text-sm text-success">Alterações salvas.</span> : null}
            </Card.Header>
            <Card.Content>
              {isProtected ? (
                <RoleReadOnly role={role} />
              ) : (
                <Can scope="roles:update" fallback={<RoleReadOnly role={role} />}>
                  <RoleForm
                    initialValues={initialValues}
                    submitLabel="Salvar alterações"
                    submitting={updateRole.isPending}
                    error={formError}
                    onSubmit={handleSubmit}
                  />
                </Can>
              )}
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
                  { label: "Nome", value: role.name },
                  { label: "Descrição", value: role.description ?? "—" },
                  { label: "Permissões", value: `${role.scopes.length}` },
                  { label: "Usuários", value: `${role.userCount}` },
                  { label: "Criada em", value: formatDate(role.createdAt) },
                ]}
              />
            </Card.Content>
          </Card>

          {isProtected ? (
            <Card>
              <Card.Content>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <LockIcon className="size-4" />
                  Role protegida pelo sistema.
                </p>
              </Card.Content>
            </Card>
          ) : (
            <Can scope="roles:delete">
              <Card>
                <Card.Header>
                  <Card.Title className="text-destructive">Zona de perigo</Card.Title>
                </Card.Header>
                <Card.Content>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Desativar a role impede que usuários continuem recebendo estas permissões.
                  </p>
                  <Button
                    variant="destructive"
                    disabled={!role.isActive || deleteRole.isPending}
                    onClick={() => setConfirmOpen(true)}
                  >
                    <Trash2Icon />
                    Desativar role
                  </Button>
                </Card.Content>
              </Card>
            </Can>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Desativar role?"
        description={`“${role.name}” deixará de conceder permissões aos usuários vinculados.`}
        confirmLabel="Desativar"
        destructive
        loading={deleteRole.isPending}
        onConfirm={() => void handleDeactivate()}
      />
    </div>
  )
}

function RoleReadOnly({ role }: { role: { name: string; description: string | null } }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">Nome</p>
        <p className="font-mono text-sm text-foreground">{role.name}</p>
      </div>
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">Descrição</p>
        <p className="text-sm text-foreground">{role.description ?? "—"}</p>
      </div>
    </div>
  )
}
