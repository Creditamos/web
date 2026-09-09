"use client"

import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/button"
import { Dialog } from "@/components/Dialog"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import {
  type ClientPersonType,
  type ClientSubclassRef,
  useClientClassifications,
  useCreateClient,
} from "@/features/clients"

interface NewClientDialogProps {
  trigger?: React.ReactNode
}

const emptyForm = {
  class_id: "",
  subclass_id: "",
  person_type: "INDIVIDUAL" as ClientPersonType,
  document_number: "",
  name: "",
  phone: "",
}

type ClientFormState = typeof emptyForm

function className(code: string, name: string): string {
  return `${code} · ${name}`
}

export function NewClientDialog({ trigger }: NewClientDialogProps) {
  const createClient = useCreateClient()
  const { data: classifications } = useClientClassifications()
  const [open, setOpen] = useState<boolean>(false)
  const [form, setForm] = useState<ClientFormState>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  const selectedClass = classifications?.classes.find((c) => c.id === form.class_id)
  const compatibleSubclasses: ClientSubclassRef[] =
    selectedClass?.subclasses.filter((subclass) =>
      subclass.allowedPersonTypes.includes(form.person_type),
    ) ?? []
  const classAllowsType =
    selectedClass === undefined || selectedClass.allowedPersonTypes.includes(form.person_type)

  const handleChange: (field: keyof ClientFormState, value: string) => void = (field, value) => {
    if (field === "person_type") {
      const nextType = value as ClientPersonType
      setForm((prev) => {
        const cls = classifications?.classes.find((c) => c.id === prev.class_id)
        const keepsClass = cls === undefined || cls.allowedPersonTypes.includes(nextType)
        const keepsSubclass =
          keepsClass &&
          (cls === undefined ||
            cls.subclasses.some(
              (subclass) =>
                subclass.id === prev.subclass_id && subclass.allowedPersonTypes.includes(nextType),
            ))
        return {
          ...prev,
          person_type: nextType,
          class_id: keepsClass ? prev.class_id : "",
          subclass_id: keepsSubclass ? prev.subclass_id : "",
        }
      })
      return
    }

    if (field === "class_id") {
      setForm((prev) => ({ ...prev, class_id: value, subclass_id: "" }))
      return
    }

    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const reset: VoidFunction = () => {
    setForm(emptyForm)
    setError(null)
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      await createClient.mutateAsync({
        person_type: form.person_type,
        document_number: form.document_number,
        name: form.name,
        class_id: form.class_id || undefined,
        subclass_id: form.subclass_id || undefined,
        phone: form.phone || undefined,
      })
      reset()
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar cliente")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        {trigger ?? (
          <>
            <PlusIcon />
            Novo Cliente
          </>
        )}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Novo Cliente</Dialog.Title>
          <Dialog.Description>Crie um novo registro de cliente na carteira.</Dialog.Description>
        </Dialog.Header>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
          <div className="space-y-1.5">
            <Label htmlFor="client-name">Nome</Label>
            <Input
              id="client-name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              placeholder="Nome completo ou razão social"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="client-document">Documento</Label>
              <Input
                id="client-document"
                value={form.document_number}
                onChange={(e) => handleChange("document_number", e.target.value)}
                required
                placeholder="CPF / CNPJ"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-phone">Telefone</Label>
              <Input
                id="client-phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="client-type">Tipo de Pessoa</Label>
              <select
                id="client-type"
                value={form.person_type}
                onChange={(e) => handleChange("person_type", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <option value="INDIVIDUAL">Pessoa Física</option>
                <option value="CORPORATE">Pessoa Jurídica</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-class">Classe</Label>
              <select
                id="client-class"
                value={form.class_id}
                onChange={(e) => handleChange("class_id", e.target.value)}
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <option value="" disabled>
                  Selecione uma classe
                </option>
                {classifications?.classes.map((clientClass) => (
                  <option
                    key={clientClass.id}
                    value={clientClass.id}
                    disabled={!clientClass.allowedPersonTypes.includes(form.person_type)}
                  >
                    {className(clientClass.code, clientClass.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client-subclass">Subclasse</Label>
            <select
              id="client-subclass"
              value={form.subclass_id}
              onChange={(e) => handleChange("subclass_id", e.target.value)}
              disabled={!selectedClass || compatibleSubclasses.length === 0}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Sem subclasse</option>
              {compatibleSubclasses.map((subclass) => (
                <option key={subclass.id} value={subclass.id}>
                  {className(subclass.code, subclass.name)}
                </option>
              ))}
            </select>
            {selectedClass && compatibleSubclasses.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Nenhuma subclasse disponível para este tipo de pessoa.
              </p>
            )}
            {!classAllowsType && (
              <p className="text-xs text-muted-foreground">
                Esta classe não aceita este tipo de pessoa.
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <Dialog.Footer>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createClient.isPending}>
              {createClient.isPending ? "Criando..." : "Criar Cliente"}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog>
  )
}
