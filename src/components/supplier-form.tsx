"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { ErrorNote } from "@/components/error-note"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/input"
import { NativeSelect } from "@/components/select-native"
import type { SupplierSubmitValues } from "@/features/suppliers"
import { useSupplierClasses } from "@/features/suppliers"

export interface SupplierFormInitialValues {
  code?: string
  name?: string
  class_id?: string | null
  subclass_id?: string | null
}

interface SupplierFormProps {
  initialValues?: SupplierFormInitialValues
  submitLabel: string
  submitting?: boolean
  error?: string | null
  onSubmit: (values: SupplierSubmitValues) => Promise<void> | void
}

function nonEmpty(value: string | undefined): string | undefined {
  return value && value.trim() !== "" ? value.trim() : undefined
}

function displayName(code?: string, name?: string): string {
  if (!name) return "—"
  return code ? `${code} · ${name}` : name
}

export function SupplierForm({
  initialValues,
  submitLabel,
  submitting = false,
  error = null,
  onSubmit,
}: SupplierFormProps) {
  const { data: classes } = useSupplierClasses()

  const [code, setCode] = useState(initialValues?.code ?? "")
  const [name, setName] = useState(initialValues?.name ?? "")
  const [classId, setClassId] = useState(initialValues?.class_id ?? "")
  const [subclassId, setSubclassId] = useState(initialValues?.subclass_id ?? "")

  const selectedClass = classes?.find((supplierClass) => supplierClass.id === classId)

  const handleClassChange = (value: string) => {
    setClassId(value)
    setSubclassId("")
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    void onSubmit({
      code,
      name,
      class_id: nonEmpty(classId),
      subclass_id: nonEmpty(subclassId),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Identificação</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="supplier-code" label="Código">
            <Input
              id="supplier-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={20}
              placeholder="033"
            />
          </FormField>

          <FormField htmlFor="supplier-name" label="Nome">
            <Input
              id="supplier-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="Banco Santander"
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Classificação</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="supplier-class" label="Classe" optional>
            <NativeSelect
              id="supplier-class"
              value={classId}
              onChange={(e) => handleClassChange(e.target.value)}
            >
              <option value="">Sem classe</option>
              {classes?.map((supplierClass) => (
                <option key={supplierClass.id} value={supplierClass.id}>
                  {displayName(supplierClass.code, supplierClass.name)}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <FormField htmlFor="supplier-subclass" label="Subclasse" optional>
            <NativeSelect
              id="supplier-subclass"
              value={subclassId}
              onChange={(e) => setSubclassId(e.target.value)}
              disabled={!selectedClass || selectedClass.subclasses.length === 0}
            >
              <option value="">Sem subclasse</option>
              {selectedClass?.subclasses.map((subclass) => (
                <option key={subclass.id} value={subclass.id}>
                  {displayName(subclass.code, subclass.name)}
                </option>
              ))}
            </NativeSelect>
          </FormField>
        </div>
      </section>

      {error ? <ErrorNote className="m-0">{error}</ErrorNote> : null}

      <div className="flex items-center justify-end border-t border-border pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
