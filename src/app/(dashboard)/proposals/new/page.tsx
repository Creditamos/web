"use client"

import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { BackLink } from "@/components/back-link"
import { Button } from "@/components/button"
import { ErrorNote } from "@/components/error-note"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { PageHeader } from "@/components/page-header"
import { NativeSelect } from "@/components/select-native"
import { StatusBadge } from "@/components/status-badge"
import { useClientByDocument } from "@/features/clients"
import { useOperators } from "@/features/operators"
import { useProducts } from "@/features/products"
import { useCreateProposal } from "@/features/proposals"
import { maskDocument } from "@/lib/format"

export default function NewProposalPage() {
  const router = useRouter()
  const createProposal = useCreateProposal()
  const { data: products } = useProducts()
  const { data: operators } = useOperators(true)

  const [clientDocument, setClientDocumentState] = useState("")
  const [clientLookup, setClientLookup] = useState("")
  const {
    data: client,
    error: clientLookupError,
    isFetching,
    refetch,
  } = useClientByDocument(clientLookup)

  const [productId, setProductId] = useState("")
  const [operatorId, setOperatorId] = useState("")
  const [amount, setAmount] = useState("")
  const [responsibleName, setResponsibleName] = useState("")
  const [responsiblePhone, setResponsiblePhone] = useState("")
  const [acceptedTerm, setAcceptedTerm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isPersonTypeMismatch =
    !!client &&
    !!productId &&
    (client.personType === "INDIVIDUAL"
      ? !products?.find((product) => product.id === productId)?.clientTypes.includes("INDIVIDUAL")
      : !products?.find((product) => product.id === productId)?.clientTypes.includes("CORPORATE"))

  const handleLookup = async () => {
    const clean = clientDocument.replace(/\D/g, "")
    if (clean.length < 11) {
      setClientLookup("")
      setError("Informe um CPF ou CNPJ válido para localizar o cliente.")
      return
    }
    setError(null)
    setClientLookup(clean)
    await refetch()
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const parsedAmount = Number(amount.replace(/\./g, "").replace(",", "."))
    if (!client) {
      setError("Localize o cliente pelo documento antes de criar a proposta.")
      return
    }
    if (!productId) {
      setError("Selecione o produto.")
      return
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Informe um valor de solicitação maior que zero.")
      return
    }
    if (!acceptedTerm) {
      setError("Você deve ler e concordar com o Termo de Aceite para prosseguir.")
      return
    }

    try {
      const proposal = await createProposal.mutateAsync({
        client_document: client.documentNumber,
        product_id: productId,
        operator_id: operatorId || undefined,
        requested_amount: parsedAmount,
        accepted_term: acceptedTerm,
        responsible_name: responsibleName || undefined,
        responsible_phone: responsiblePhone.replace(/\D/g, "") || undefined,
      })
      router.push(`/proposals/${proposal.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar a proposta.")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumb={<BackLink href="/proposals" label="Propostas" />}
        title="Nova proposta"
        description="Registre uma nova solicitação de crédito."
      />

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Cliente</h2>

          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="client-document">Documento</Label>
              <Input
                id="client-document"
                value={clientDocument}
                onChange={(e) => {
                  setClientDocumentState(e.target.value)
                  setClientLookup("")
                }}
                placeholder="CPF / CNPJ do cliente"
                inputMode="numeric"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={isFetching}
              onClick={() => void handleLookup()}
            >
              <SearchIcon />
              {isFetching ? "Buscando..." : "Localizar"}
            </Button>
          </div>

          {client ? (
            <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
              <span className="font-medium text-foreground">{client.name}</span>
              <span className="text-muted-foreground">{maskDocument(client.documentNumber)}</span>
              {client.isActive ? null : <StatusBadge tone="warning">Cliente inativo</StatusBadge>}
            </div>
          ) : clientLookupError ? (
            <p className="text-sm text-destructive">
              {clientLookupError instanceof Error
                ? clientLookupError.message
                : "Cliente não encontrado para este documento."}
            </p>
          ) : null}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Dados da proposta</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField htmlFor="product-id" label="Produto">
              <NativeSelect
                id="product-id"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
              >
                <option value="">Selecione um produto</option>
                {products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.code} · {product.name}
                  </option>
                ))}
              </NativeSelect>
            </FormField>

            <FormField htmlFor="operator-id" label="Operador" optional>
              <NativeSelect
                id="operator-id"
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
              >
                <option value="">Selecione um operador</option>
                {operators?.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.fullName} ({operator.code})
                  </option>
                ))}
              </NativeSelect>
            </FormField>

            <FormField htmlFor="requested-amount" label="Valor da solicitação">
              <Input
                id="requested-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                inputMode="decimal"
                required
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
            <FormField htmlFor="responsible-name" label="Nome do cliente (Responsável)">
              <Input
                id="responsible-name"
                value={responsibleName}
                onChange={(e) => setResponsibleName(e.target.value)}
                placeholder="Nome completo do indicado"
                required
              />
            </FormField>

            <FormField htmlFor="responsible-phone" label="WhatsApp do cliente">
              <Input
                id="responsible-phone"
                value={responsiblePhone}
                onChange={(e) => setResponsiblePhone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
            </FormField>
          </div>

          {isPersonTypeMismatch && (
            <p className="text-sm text-warning">
              O produto selecionado não atende ao tipo de pessoa deste cliente.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="accept-term"
              checked={acceptedTerm}
              onChange={(e) => setAcceptedTerm(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="accept-term" className="text-sm font-normal text-foreground leading-snug">
              Declaro que li e concordo com o Termo de Aceite do Parceiro, estando ciente das regras de negócio e das condições para prosseguimento desta indicação.
            </Label>
          </div>
        </section>

        {error ? <ErrorNote className="m-0">{error}</ErrorNote> : null}

        <div className="flex items-center justify-end border-t border-border pt-4">
          <Button type="submit" disabled={createProposal.isPending}>
            {createProposal.isPending ? "Criando..." : "Criar proposta"}
          </Button>
        </div>
      </form>
    </div>
  )
}
