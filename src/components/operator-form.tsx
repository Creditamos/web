"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { ErrorNote } from "@/components/error-note"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/input"
import { NativeSelect } from "@/components/select-native"
import type { OperatorSubmitValues } from "@/features/operators"
import { useSuppliers } from "@/features/suppliers"

export interface OperatorFormInitialValues {
  supplier_id?: string
  code?: string
  full_name?: string
  cpf?: string
  phone?: string
  email?: string
  rg?: string
  birth_date?: string
}

interface OperatorFormProps {
  initialValues?: OperatorFormInitialValues
  submitLabel: string
  submitting?: boolean
  error?: string | null
  onSubmit: (values: OperatorSubmitValues) => Promise<void> | void
}

function cleanDigits(value: string | undefined): string | undefined {
  const digits = (value ?? "").replace(/\D/g, "")
  return digits || undefined
}

function cleanOptional(value: string | undefined): string | undefined {
  const trimmed = (value ?? "").trim()
  return trimmed || undefined
}

export function OperatorForm({
  initialValues,
  submitLabel,
  submitting = false,
  error = null,
  onSubmit,
}: OperatorFormProps) {
  const { data: suppliers } = useSuppliers()

  const [supplierId, setSupplierId] = useState(initialValues?.supplier_id ?? "")
  const [code, setCode] = useState(initialValues?.code ?? "")
  const [fullName, setFullName] = useState(initialValues?.full_name ?? "")
  const [cpf, setCpf] = useState(initialValues?.cpf ?? "")
  const [phone, setPhone] = useState(initialValues?.phone ?? "")
  const [email, setEmail] = useState(initialValues?.email ?? "")
  const [rg, setRg] = useState(initialValues?.rg ?? "")
  const [birthDate, setBirthDate] = useState(initialValues?.birth_date ?? "")

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    void onSubmit({
      supplier_id: supplierId,
      code,
      full_name: fullName,
      cpf: cleanDigits(cpf) ?? "",
      phone: cleanDigits(phone),
      email: cleanOptional(email),
      rg: cleanOptional(rg),
      birth_date: cleanOptional(birthDate),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Vínculo</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="operator-supplier" label="Banco">
            <NativeSelect
              id="operator-supplier"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
            >
              <option value="">Selecione um banco</option>
              {suppliers?.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.code} · {supplier.name}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <FormField htmlFor="operator-code" label="Código">
            <Input
              id="operator-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              maxLength={20}
              placeholder="OP-006"
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Identificação</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="operator-full-name" label="Nome completo">
            <Input
              id="operator-full-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              minLength={3}
              maxLength={255}
              placeholder="João Pereira"
            />
          </FormField>

          <FormField htmlFor="operator-cpf" label="CPF">
            <Input
              id="operator-cpf"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
              inputMode="numeric"
              maxLength={14}
              placeholder="000.000.000-00"
            />
          </FormField>

          <FormField htmlFor="operator-phone" label="Telefone" optional>
            <Input
              id="operator-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              maxLength={20}
              placeholder="(11) 99999-0000"
            />
          </FormField>

          <FormField htmlFor="operator-email" label="E-mail" optional>
            <Input
              id="operator-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              placeholder="joao.pereira@creditamos.com.br"
            />
          </FormField>

          <FormField htmlFor="operator-rg" label="RG" optional>
            <Input
              id="operator-rg"
              value={rg}
              onChange={(e) => setRg(e.target.value)}
              maxLength={20}
              placeholder="11.222.333-4"
            />
          </FormField>

          <FormField htmlFor="operator-birth-date" label="Data de nascimento" optional>
            <Input
              id="operator-birth-date"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
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
