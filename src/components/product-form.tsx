"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { ErrorNote } from "@/components/error-note"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/input"
import { NativeSelect } from "@/components/select-native"
import type { CreateProductInput, ProductClientType } from "@/features/products"
import { useProductClasses } from "@/features/products"
import { useSuppliers } from "@/features/suppliers"

export interface ProductFormInitialValues {
  id?: string
  code?: string
  name?: string
  supplier_id?: string | null
  class_id?: string | null
  subclass_id?: string | null
  client_types?: ProductClientType[]
}

interface ProductFormProps {
  initialValues?: ProductFormInitialValues
  submitLabel: string
  submitting?: boolean
  error?: string | null
  onSubmit: (values: CreateProductInput) => Promise<void> | void
}

function displayName(code?: string, name?: string): string {
  if (!name) return "—"
  return code ? `${code} · ${name}` : name
}

export function ProductForm({
  initialValues,
  submitLabel,
  submitting = false,
  error = null,
  onSubmit,
}: ProductFormProps) {
  const { data: suppliers } = useSuppliers()
  const { data: classes } = useProductClasses()

  const [code, setCode] = useState(initialValues?.code ?? "")
  const [name, setName] = useState(initialValues?.name ?? "")
  const [supplierId, setSupplierId] = useState(initialValues?.supplier_id ?? "")
  const [classId, setClassId] = useState(initialValues?.class_id ?? "")
  const [subclassId, setSubclassId] = useState(initialValues?.subclass_id ?? "")

  const initialAudience =
    initialValues?.client_types?.includes("CORPORATE") &&
    initialValues?.client_types?.includes("INDIVIDUAL")
      ? "BOTH"
      : initialValues?.client_types?.includes("CORPORATE")
        ? "CORPORATE"
        : "INDIVIDUAL"
  const [audience, setAudience] = useState<string>(initialAudience)

  const selectedClass = classes?.find((c) => c.id === classId)

  const handleClassChange = (value: string) => {
    setClassId(value)
    setSubclassId("")
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const clientTypes: ProductClientType[] =
      audience === "BOTH"
        ? ["INDIVIDUAL", "CORPORATE"]
        : audience === "CORPORATE"
          ? ["CORPORATE"]
          : ["INDIVIDUAL"]

    void onSubmit({
      code: code.trim(),
      name: name.trim(),
      supplier_id: supplierId,
      class_id: classId,
      subclass_id: subclassId || undefined,
      client_types: clientTypes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? <ErrorNote>{error}</ErrorNote> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField htmlFor="product-code" label="Código do produto">
          <Input
            id="product-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ex.: 001"
            required
            maxLength={20}
          />
        </FormField>

        <FormField htmlFor="product-name" label="Nome do produto">
          <Input
            id="product-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: CDC Veículos"
            required
            maxLength={100}
          />
        </FormField>

        <FormField
          htmlFor="product-supplier"
          label="Fornecedor / Banco originador"
          hint="Instituição que fornece a linha de crédito."
        >
          <NativeSelect
            id="product-supplier"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            required
          >
            <option value="">Selecione um fornecedor...</option>
            {suppliers?.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {displayName(supplier.code, supplier.name)}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField
          htmlFor="product-audience"
          label="Público-alvo"
          hint="Tipos de clientes que podem contratar."
        >
          <NativeSelect
            id="product-audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            required
          >
            <option value="BOTH">Pessoa física e pessoa jurídica</option>
            <option value="INDIVIDUAL">Apenas Pessoa física</option>
            <option value="CORPORATE">Apenas Pessoa jurídica</option>
          </NativeSelect>
        </FormField>

        <FormField
          htmlFor="product-class"
          label="Modalidade / Classe"
          hint="Categoria de negócio do produto de crédito."
        >
          <NativeSelect
            id="product-class"
            value={classId}
            onChange={(e) => handleClassChange(e.target.value)}
            required
          >
            <option value="">Selecione uma classe...</option>
            {classes?.map((c) => (
              <option key={c.id} value={c.id}>
                {displayName(c.code, c.name)}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField
          htmlFor="product-subclass"
          label="Subclasse"
          optional
          hint="Especialização da modalidade (ex.: CDC, Consignado)."
        >
          <NativeSelect
            id="product-subclass"
            value={subclassId}
            onChange={(e) => setSubclassId(e.target.value)}
            disabled={!selectedClass || selectedClass.subclasses.length === 0}
          >
            <option value="">Nenhuma subclasse</option>
            {selectedClass?.subclasses.map((subclass) => (
              <option key={subclass.id} value={subclass.id}>
                {displayName(subclass.code, subclass.name)}
              </option>
            ))}
          </NativeSelect>
        </FormField>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
