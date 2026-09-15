"use client"

import { cn } from "cn"
import { CheckIcon, PencilIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/button"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { ErrorNote } from "@/components/error-note"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Loading } from "@/components/loading"
import type { ClientClassRef, ClientGroupRef } from "@/features/clients"
import {
  type ClassificationSubmitValues,
  useClientClassifications,
  useCreateClassification,
  useDeleteClassification,
  useUpdateClassification,
} from "@/features/clients"

type PersonType = "INDIVIDUAL" | "CORPORATE"

function PersonTypeChip({
  personType,
  selected,
  onClick,
  disabled,
}: {
  personType: PersonType
  selected: boolean
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1 rounded-md border px-2.5 font-mono text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
        selected
          ? "border-border bg-muted text-foreground"
          : "border-border/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {selected ? <CheckIcon className="size-3 text-success" /> : null}
      {personType === "INDIVIDUAL" ? "PF" : "PJ"}
    </button>
  )
}

function PersonTypesLabel({ personTypes }: { personTypes: PersonType[] }) {
  return (
    <span className="font-mono text-xs text-muted-foreground">
      {personTypes.map((personType) => (personType === "CORPORATE" ? "PJ" : "PF")).join(" · ")}
    </span>
  )
}

interface InlineEditorProps {
  onCancel: () => void
  allowsPersonTypes?: boolean
  onSubmit: (values: ClassificationSubmitValues) => Promise<void>
}

function InlineEditor({ onCancel, allowsPersonTypes = false, onSubmit }: InlineEditorProps) {
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [personTypes, setPersonTypes] = useState<PersonType[]>(["INDIVIDUAL", "CORPORATE"])
  const [submitting, setSubmitting] = useState(false)

  const togglePersonType = (personType: PersonType) => {
    setPersonTypes((prev) =>
      prev.includes(personType) ? prev.filter((p) => p !== personType) : [...prev, personType],
    )
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        code,
        name,
        ...(allowsPersonTypes ? { allowed_person_types: personTypes } : {}),
      })
      setCode("")
      setName("")
      onCancel()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-muted/30 p-3 sm:grid-cols-[8rem_1fr_auto] sm:items-end"
    >
      <div className="space-y-1.5">
        <Label htmlFor="node-code">Código</Label>
        <Input
          id="node-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          maxLength={20}
          placeholder="1.1"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="node-name">Nome</Label>
        <Input
          id="node-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          placeholder="Descrição da classificação"
        />
      </div>
      <div className="flex items-center gap-2">
        {allowsPersonTypes ? (
          <div className="flex gap-1.5">
            {(["INDIVIDUAL", "CORPORATE"] as const).map((personType) => (
              <PersonTypeChip
                key={personType}
                personType={personType}
                selected={personTypes.includes(personType)}
                onClick={() => togglePersonType(personType)}
              />
            ))}
          </div>
        ) : null}
        <div className="ml-auto flex items-center gap-1">
          <Button type="button" size="icon-xs" variant="ghost" onClick={onCancel} title="Cancelar">
            <XIcon />
          </Button>
          <Button type="submit" size="sm" disabled={submitting}>
            Salvar
          </Button>
        </div>
      </div>
    </form>
  )
}

interface EditableRowProps {
  code: string
  name: string
  isProtected?: boolean
  onEdited: (patch: { code: string; name: string }) => Promise<void>
  onDelete: () => Promise<void>
  error: string | null
  onError: (message: string) => void
  children?: React.ReactNode
}

function EditableRow({
  code,
  name,
  isProtected = false,
  onEdited,
  onDelete,
  error,
  onError,
  children,
}: EditableRowProps) {
  const [editing, setEditing] = useState(false)
  const [editCode, setEditCode] = useState(code)
  const [editName, setEditName] = useState(name)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    onError("")
    try {
      await onEdited({ code: editCode, name: editName })
      setEditing(false)
    } catch (err) {
      onError(err instanceof Error ? err.message : "Falha ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    onError("")
    try {
      await onDelete()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Falha ao desativar.")
    } finally {
      setConfirmOpen(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
        <span className="font-mono text-xs text-foreground">{editCode}</span>
        <span className="min-w-0 truncate text-sm font-medium text-foreground">{editName}</span>
        <div className="flex items-center justify-end gap-1">
          {editing ? (
            <>
              <Input
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
                maxLength={20}
                className="h-8 w-24 font-mono text-xs"
              />
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={100}
                className="h-8 w-44 text-sm"
              />
              <div className="flex items-center gap-1">
                <Button
                  size="icon-xs"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                  title="Cancelar"
                >
                  <XIcon />
                </Button>
                <Button
                  size="icon-xs"
                  onClick={() => void handleSave()}
                  disabled={saving}
                  title="Salvar"
                >
                  <CheckIcon />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <Button
                size="icon-xs"
                variant="ghost"
                title="Editar"
                onClick={() => setEditing(true)}
              >
                <PencilIcon />
              </Button>
              <Button
                size="icon-xs"
                variant="ghost"
                disabled={isProtected}
                title="Desativar"
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2Icon className="text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>
      </div>
      {confirmOpen ? (
        <ConfirmedDelete
          open={confirmOpen}
          title={name}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => void handleDelete()}
        />
      ) : null}
      {error ? (
        <div className="border-t border-border bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      {children ? <div className="border-t border-border bg-muted/30">{children}</div> : null}
    </div>
  )
}

function ConfirmedDelete({
  open,
  title,
  onCancel,
  onConfirm,
}: {
  open: boolean
  title: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => (next ? undefined : onCancel())}
      title="Desativar item?"
      description={`“${title}” deixará de aparecer nas classificações e não poderá ser selecionado em novos cadastros.`}
      confirmLabel="Desativar"
      destructive
      onConfirm={onConfirm}
    />
  )
}

export function ClassificationManager() {
  const { data: classifications, isLoading, error: queryError } = useClientClassifications()
  const createClassification = useCreateClassification()
  const updateClassification = useUpdateClassification()
  const deleteClassification = useDeleteClassification()

  const [error, setError] = useState<string | null>(null)
  const [createClassOpen, setCreateClassOpen] = useState(false)
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [subclassFor, setSubclassFor] = useState<string | null>(null)
  const [subgroupFor, setSubgroupFor] = useState<string | null>(null)

  if (isLoading) {
    return <Loading />
  }

  if (queryError) {
    return (
      <ErrorNote className="m-0">
        Não foi possível carregar as classificações. {queryError.message}
      </ErrorNote>
    )
  }

  const classes = classifications?.classes ?? []
  const groups = classifications?.groups ?? []

  return (
    <div className="space-y-8">
      {error ? <ErrorNote className="m-0">{error}</ErrorNote> : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Classes de clientes</h2>
            <p className="text-xs text-muted-foreground">
              Segmentam o perfil do cliente (ex.: servidor público, aposentado).
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setCreateClassOpen(true)}>
            <PlusIcon />
            Adicionar classe
          </Button>
        </div>

        {createClassOpen ? (
          <InlineEditor
            allowsPersonTypes
            onCancel={() => setCreateClassOpen(false)}
            onSubmit={(values) =>
              createClassification.mutateAsync({ kind: "class", input: values }).then(() => {})
            }
          />
        ) : null}

        {classes.length === 0 ? (
          <EmptyList label="Nenhuma classe cadastrada." />
        ) : (
          <div className="space-y-2">
            {classes.map((clientClass) => (
              <ClassRow
                key={clientClass.id}
                clientClass={clientClass}
                createClassification={createClassification}
                updateClassification={updateClassification}
                deleteClassification={deleteClassification}
                subclassFor={subclassFor}
                onSubclassForChange={setSubclassFor}
                onError={setError}
              />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Grupos de clientes</h2>
            <p className="text-xs text-muted-foreground">
              Agrupam estruturas organizacionais (ex.: grupos econômicos).
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setCreateGroupOpen(true)}>
            <PlusIcon />
            Adicionar grupo
          </Button>
        </div>

        {createGroupOpen ? (
          <InlineEditor
            onCancel={() => setCreateGroupOpen(false)}
            onSubmit={(values) =>
              createClassification.mutateAsync({ kind: "group", input: values }).then(() => {})
            }
          />
        ) : null}

        {groups.length === 0 ? (
          <EmptyList label="Nenhum grupo cadastrado." />
        ) : (
          <div className="space-y-2">
            {groups.map((group) => (
              <GroupRow
                key={group.id}
                group={group}
                createClassification={createClassification}
                updateClassification={updateClassification}
                deleteClassification={deleteClassification}
                subgroupFor={subgroupFor}
                onSubgroupForChange={setSubgroupFor}
                onError={setError}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function EmptyList({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {label}
    </div>
  )
}

interface MutationHooks {
  createClassification: ReturnType<typeof useCreateClassification>
  updateClassification: ReturnType<typeof useUpdateClassification>
  deleteClassification: ReturnType<typeof useDeleteClassification>
}

function ClassRow({
  clientClass,
  createClassification,
  updateClassification,
  deleteClassification,
  subclassFor,
  onSubclassForChange,
  onError,
}: MutationHooks & {
  clientClass: ClientClassRef
  subclassFor: string | null
  onSubclassForChange: (id: string | null) => void
  onError: (message: string) => void
}) {
  const [rowError, setRowError] = useState<string | null>(null)
  const localError = (message: string) => {
    onError(message)
    setRowError(message)
  }

  return (
    <EditableRow
      code={clientClass.code}
      name={clientClass.name}
      onEdited={(patch) =>
        updateClassification
          .mutateAsync({ kind: "class", id: clientClass.id, input: patch })
          .then(() => {})
      }
      onDelete={() =>
        deleteClassification.mutateAsync({ kind: "class", id: clientClass.id }).then(() => {
          onError("")
          setRowError("")
        })
      }
      error={rowError}
      onError={localError}
    >
      <div className="space-y-3 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <PersonTypesLabel personTypes={clientClass.allowedPersonTypes} />
          {clientClass.subclasses.length === 0 ? (
            <span className="text-xs text-muted-foreground">Sem subclasses</span>
          ) : null}
        </div>
        {clientClass.subclasses.length > 0 ? (
          <div className="space-y-2">
            {clientClass.subclasses.map((subclass) => (
              <EditableRow
                key={subclass.id}
                code={subclass.code}
                name={subclass.name}
                onEdited={(patch) =>
                  updateClassification
                    .mutateAsync({
                      kind: "subclass",
                      id: subclass.id,
                      input: patch,
                    })
                    .then(() => {})
                }
                onDelete={() =>
                  deleteClassification
                    .mutateAsync({ kind: "subclass", id: subclass.id })
                    .then(() => {
                      onError("")
                      setRowError("")
                    })
                }
                error={rowError}
                onError={localError}
              />
            ))}
          </div>
        ) : null}
        {subclassFor === clientClass.id ? (
          <InlineEditor
            allowsPersonTypes
            onCancel={() => onSubclassForChange(null)}
            onSubmit={(values) =>
              createClassification
                .mutateAsync({ kind: "subclass", parentId: clientClass.id, input: values })
                .then(() => onSubclassForChange(null))
            }
          />
        ) : (
          <Button
            size="xs"
            variant="ghost"
            type="button"
            onClick={() => onSubclassForChange(clientClass.id)}
          >
            <PlusIcon />
            Adicionar subclasse
          </Button>
        )}
      </div>
    </EditableRow>
  )
}

function GroupRow({
  group,
  createClassification,
  updateClassification,
  deleteClassification,
  subgroupFor,
  onSubgroupForChange,
  onError,
}: MutationHooks & {
  group: ClientGroupRef
  subgroupFor: string | null
  onSubgroupForChange: (id: string | null) => void
  onError: (message: string) => void
}) {
  const [rowError, setRowError] = useState<string | null>(null)
  const localError = (message: string) => {
    onError(message)
    setRowError(message)
  }

  return (
    <EditableRow
      code={group.code}
      name={group.name}
      onEdited={(patch) =>
        updateClassification
          .mutateAsync({ kind: "group", id: group.id, input: patch })
          .then(() => {})
      }
      onDelete={() =>
        deleteClassification.mutateAsync({ kind: "group", id: group.id }).then(() => {
          onError("")
          setRowError("")
        })
      }
      error={rowError}
      onError={localError}
    >
      <div className="space-y-3 p-3">
        {group.subgroups.length === 0 ? (
          <span className="text-xs text-muted-foreground">Sem subgrupos</span>
        ) : (
          <div className="space-y-2">
            {group.subgroups.map((subgroup) => (
              <EditableRow
                key={subgroup.id}
                code={subgroup.code}
                name={subgroup.name}
                onEdited={(patch) =>
                  updateClassification
                    .mutateAsync({
                      kind: "subgroup",
                      id: subgroup.id,
                      input: patch,
                    })
                    .then(() => {})
                }
                onDelete={() =>
                  deleteClassification
                    .mutateAsync({ kind: "subgroup", id: subgroup.id })
                    .then(() => {
                      onError("")
                      setRowError("")
                    })
                }
                error={rowError}
                onError={localError}
              />
            ))}
          </div>
        )}
        {subgroupFor === group.id ? (
          <InlineEditor
            onCancel={() => onSubgroupForChange(null)}
            onSubmit={(values) =>
              createClassification
                .mutateAsync({ kind: "subgroup", parentId: group.id, input: values })
                .then(() => onSubgroupForChange(null))
            }
          />
        ) : (
          <Button
            size="xs"
            variant="ghost"
            type="button"
            onClick={() => onSubgroupForChange(group.id)}
          >
            <PlusIcon />
            Adicionar subgrupo
          </Button>
        )}
      </div>
    </EditableRow>
  )
}
