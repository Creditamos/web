"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { ErrorNote } from "@/components/error-note"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/input"
import { SegmentedControl } from "@/components/segmented-control"
import { NativeSelect } from "@/components/select-native"
import {
  type ClientAccountType,
  type ClientPersonType,
  type ClientSubclassRef,
  useClientClassifications,
  useClients,
} from "@/features/clients"

export interface ClientFormInitialValues {
  id?: string
  person_type?: ClientPersonType
  document_number?: string
  name?: string
  phone?: string | null
  class_id?: string | null
  subclass_id?: string | null
  group_id?: string | null
  subgroup_id?: string | null
  headquarters_id?: string | null
  master_agent_id?: string | null
  bank_code?: string | null
  agency?: string | null
  account?: string | null
  account_digit?: string | null
  account_type?: ClientAccountType | string | null
}

interface ClientFormProps {
  initialValues?: ClientFormInitialValues
  submitLabel: string
  submitting?: boolean
  error?: string | null
  readOnlyFields?: Array<"document_number" | "person_type">
  onSubmit: (values: ClientSubmitValues) => Promise<void> | void
}

export interface ClientFormValues {
  person_type: ClientPersonType
  document_number: string
  name: string
  phone: string
  class_id: string
  subclass_id: string
  group_id: string
  subgroup_id: string
  headquarters_id: string
  master_agent_id: string
  bank_code: string
  agency: string
  account: string
  account_digit: string
  account_type: ClientAccountType | ""
}

export interface ClientSubmitValues {
  person_type: ClientPersonType
  document_number: string
  name: string
  phone?: string
  class_id?: string
  subclass_id?: string
  group_id?: string
  subgroup_id?: string
  headquarters_id?: string
  master_agent_id?: string
  bank_code?: string
  agency?: string
  account?: string
  account_digit?: string
  account_type?: ClientAccountType
}

const emptyValues: ClientFormValues = {
  person_type: "INDIVIDUAL",
  document_number: "",
  name: "",
  phone: "",
  class_id: "",
  subclass_id: "",
  group_id: "",
  subgroup_id: "",
  headquarters_id: "",
  master_agent_id: "",
  bank_code: "",
  agency: "",
  account: "",
  account_digit: "",
  account_type: "",
}

function nonEmpty(value: string | undefined): string | undefined {
  return value && value.trim() !== "" ? value.trim() : undefined
}

function displayName(code?: string, name?: string): string {
  if (!name) return "—"
  return code ? `${code} · ${name}` : name
}

export function ClientForm({
  initialValues,
  submitLabel,
  submitting = false,
  error = null,
  readOnlyFields = [],
  onSubmit,
}: ClientFormProps) {
  const { data: classifications } = useClientClassifications()
  const { data: clients } = useClients()

  const [values, setValues] = useState<ClientFormValues>(() => ({
    ...emptyValues,
    ...(initialValues?.person_type ? { person_type: initialValues.person_type } : {}),
    document_number: initialValues?.document_number ?? "",
    name: initialValues?.name ?? "",
    phone: initialValues?.phone ?? "",
    class_id: initialValues?.class_id ?? "",
    subclass_id: initialValues?.subclass_id ?? "",
    group_id: initialValues?.group_id ?? "",
    subgroup_id: initialValues?.subgroup_id ?? "",
    headquarters_id: initialValues?.headquarters_id ?? "",
    master_agent_id: initialValues?.master_agent_id ?? "",
    bank_code: initialValues?.bank_code ?? "",
    agency: initialValues?.agency ?? "",
    account: initialValues?.account ?? "",
    account_digit: initialValues?.account_digit ?? "",
    account_type: (initialValues?.account_type as ClientAccountType | "") ?? "",
  }))

  const isCorporate = values.person_type === "CORPORATE"
  const selectedClass = classifications?.classes.find((c) => c.id === values.class_id)
  const compatibleSubclasses: ClientSubclassRef[] =
    selectedClass?.subclasses.filter((subclass) =>
      subclass.allowedPersonTypes.includes(values.person_type),
    ) ?? []
  const selectedGroup = classifications?.groups.find((g) => g.id === values.group_id)
  const compatibleSubgroups = selectedGroup?.subgroups ?? []

  const headquarterCandidates =
    clients?.filter(
      (client) =>
        client.personType === "CORPORATE" &&
        client.id !== initialValues?.id &&
        client.id !== values.headquarters_id,
    ) ?? []

  const masterAgentCandidates =
    clients?.filter((client) => {
      if (client.id === initialValues?.id) return false
      if (client.id === values.master_agent_id) return true
      const isPartner =
        client.class?.code === "2" ||
        client.subclass?.code === "1.10" ||
        client.subclass?.code === "1.11"
      return isPartner
    }) ?? []

  const availableMasterAgents =
    masterAgentCandidates.length > 0
      ? masterAgentCandidates
      : (clients?.filter((c) => c.id !== initialValues?.id) ?? [])

  const setField = (field: keyof ClientFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  const handlePersonTypeChange = (next: ClientPersonType) => {
    setValues((prev) => {
      const cls = classifications?.classes.find((c) => c.id === prev.class_id)
      const keepsClass = cls === undefined || cls.allowedPersonTypes.includes(next)
      const keepsSubclass = keepsClass
        ? cls === undefined ||
          cls.subclasses.some(
            (subclass) =>
              subclass.id === prev.subclass_id && subclass.allowedPersonTypes.includes(next),
          )
        : false
      return {
        ...prev,
        person_type: next,
        class_id: keepsClass ? prev.class_id : "",
        subclass_id: keepsSubclass ? prev.subclass_id : "",
      }
    })
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    void onSubmit({
      person_type: values.person_type,
      document_number: values.document_number,
      name: values.name,
      phone: nonEmpty(values.phone),
      class_id: nonEmpty(values.class_id),
      subclass_id: nonEmpty(values.subclass_id),
      group_id: nonEmpty(values.group_id),
      subgroup_id: nonEmpty(values.subgroup_id),
      headquarters_id: nonEmpty(values.headquarters_id),
      master_agent_id: nonEmpty(values.master_agent_id),
      bank_code: nonEmpty(values.bank_code),
      agency: nonEmpty(values.agency),
      account: nonEmpty(values.account),
      account_digit: nonEmpty(values.account_digit),
      account_type: values.account_type === "" ? undefined : values.account_type,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Identificação</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="client-person-type" label="Tipo de pessoa">
            <SegmentedControl
              aria-label="Tipo de pessoa"
              className="block w-full sm:w-fit"
              disabled={readOnlyFields.includes("person_type")}
              value={values.person_type}
              onValueChange={handlePersonTypeChange}
              options={[
                { value: "INDIVIDUAL", label: "Pessoa Física" },
                { value: "CORPORATE", label: "Pessoa Jurídica" },
              ]}
            />
          </FormField>

          <FormField htmlFor="client-document" label="Documento (CPF/CNPJ)">
            <Input
              id="client-document"
              value={values.document_number}
              onChange={(e) => setField("document_number", e.target.value)}
              disabled={readOnlyFields.includes("document_number")}
              required={!readOnlyFields.includes("document_number")}
              placeholder={isCorporate ? "00.000.000/0000-00" : "000.000.000-00"}
            />
          </FormField>

          <FormField htmlFor="client-name" label="Nome">
            <Input
              id="client-name"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              required
              placeholder={isCorporate ? "Razão social" : "Nome completo"}
            />
          </FormField>

          <FormField htmlFor="client-phone" label="Telefone" optional>
            <Input
              id="client-phone"
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Segmentação e organização</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField htmlFor="client-class" label="Classe" optional>
            <NativeSelect
              id="client-class"
              value={values.class_id}
              onChange={(e) => setField("class_id", e.target.value)}
            >
              <option value="">Selecione uma classe</option>
              {classifications?.classes
                .filter((clientClass) =>
                  clientClass.allowedPersonTypes.includes(values.person_type),
                )
                .map((clientClass) => (
                  <option key={clientClass.id} value={clientClass.id}>
                    {displayName(clientClass.code, clientClass.name)}
                  </option>
                ))}
            </NativeSelect>
          </FormField>

          <FormField htmlFor="client-subclass" label="Subclasse" optional>
            <NativeSelect
              id="client-subclass"
              value={values.subclass_id}
              onChange={(e) => setField("subclass_id", e.target.value)}
              disabled={!selectedClass || compatibleSubclasses.length === 0}
            >
              <option value="">Sem subclasse</option>
              {compatibleSubclasses.map((subclass) => (
                <option key={subclass.id} value={subclass.id}>
                  {displayName(subclass.code, subclass.name)}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <FormField htmlFor="client-group" label="Grupo" optional>
            <NativeSelect
              id="client-group"
              value={values.group_id}
              onChange={(e) => setField("group_id", e.target.value)}
            >
              <option value="">Sem grupo</option>
              {classifications?.groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {displayName(group.code, group.name)}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <FormField htmlFor="client-subgroup" label="Subgrupo" optional>
            <NativeSelect
              id="client-subgroup"
              value={values.subgroup_id}
              onChange={(e) => setField("subgroup_id", e.target.value)}
              disabled={!selectedGroup || compatibleSubgroups.length === 0}
            >
              <option value="">Sem subgrupo</option>
              {compatibleSubgroups.map((subgroup) => (
                <option key={subgroup.id} value={subgroup.id}>
                  {displayName(subgroup.code, subgroup.name)}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <FormField
            htmlFor="client-headquarters"
            label={isCorporate ? "Matriz" : "Empresa / Filial"}
            optional
            hint={
              isCorporate
                ? "Deixe vazio se este cliente for a matriz do grupo."
                : "Selecione a matriz ou filial à qual este vendedor pertence."
            }
          >
            <NativeSelect
              id="client-headquarters"
              value={values.headquarters_id}
              onChange={(e) => setField("headquarters_id", e.target.value)}
              className="sm:col-span-2"
            >
              <option value="">
                {isCorporate ? "Sem matriz (é a matriz do grupo)" : "Selecione a empresa/filial"}
              </option>
              {headquarterCandidates.map((client) => (
                <option key={client.id} value={client.id}>
                  {displayName(client.code, client.name)}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <FormField
            htmlFor="client-master-agent"
            label="Representante / Parceiro Master"
            optional
            hint="Parceiro ou representante responsável pela captação ou indicação (PF ou PJ)."
          >
            <NativeSelect
              id="client-master-agent"
              value={values.master_agent_id}
              onChange={(e) => setField("master_agent_id", e.target.value)}
              className="sm:col-span-2"
            >
              <option value="">Nenhum (sem representante vinculado)</option>
              {availableMasterAgents.map((client) => (
                <option key={client.id} value={client.id}>
                  {displayName(client.code, client.name)} (
                  {client.personType === "CORPORATE" ? "PJ" : "PF"}
                  {client.subclass?.name ? ` · ${client.subclass.name}` : ""})
                </option>
              ))}
            </NativeSelect>
          </FormField>
        </div>
      </section>

      {isCorporate ? (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Dados bancários</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <FormField htmlFor="client-bank-code" label="Banco" optional>
              <Input
                id="client-bank-code"
                value={values.bank_code}
                onChange={(e) => setField("bank_code", e.target.value)}
                placeholder="341"
                inputMode="numeric"
              />
            </FormField>
            <FormField htmlFor="client-agency" label="Agência" optional>
              <Input
                id="client-agency"
                value={values.agency}
                onChange={(e) => setField("agency", e.target.value)}
                placeholder="0000"
                inputMode="numeric"
              />
            </FormField>
            <FormField htmlFor="client-account" label="Conta" optional>
              <Input
                id="client-account"
                value={values.account}
                onChange={(e) => setField("account", e.target.value)}
                placeholder="00000000"
                inputMode="numeric"
              />
            </FormField>
            <FormField htmlFor="client-account-digit" label="Dígito" optional>
              <Input
                id="client-account-digit"
                value={values.account_digit}
                onChange={(e) => setField("account_digit", e.target.value)}
                placeholder="0"
              />
            </FormField>
            <FormField htmlFor="client-account-type" label="Tipo" optional>
              <NativeSelect
                id="client-account-type"
                value={values.account_type}
                onChange={(e) => setField("account_type", e.target.value)}
              >
                <option value="">Não informado</option>
                <option value="CHECKING">Conta corrente</option>
                <option value="SAVINGS">Poupança</option>
              </NativeSelect>
            </FormField>
          </div>
        </section>
      ) : null}

      {error ? <ErrorNote className="m-0">{error}</ErrorNote> : null}

      <div className="flex items-center justify-end border-t border-border pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
