"use client";

import { useEffect, useState } from "react";
import { FilePlus2Icon } from "lucide-react";
import { CreateProposalMutationResult, useCreateProposal } from "@/features/proposals";
import { useClientByDocument } from "@/features/clients";
import { useProducts } from "@/features/products";
import { useOperators } from "@/features/operators";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";

interface NewProposalDialogProps {
  trigger?: React.ReactNode;
}

const emptyForm = {
  client_document: "",
  product_id: "",
  operator_id: "",
  requested_amount: "",
};

const MIN_CLIENT_DOCUMENT_LENGTH = 11;
const DOCUMENT_DEBOUNCE_MS = 400;

export function NewProposalDialog({ trigger }: NewProposalDialogProps) {
  const createProposal: CreateProposalMutationResult = useCreateProposal();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: operators, isLoading: operatorsLoading } = useOperators();

  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const normalizedDocument = form.client_document.trim().replace(/\D/g, "");
  const [debouncedDocument, setDebouncedDocument] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedDocument(normalizedDocument),
      DOCUMENT_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [normalizedDocument]);

  const clientQuery = useClientByDocument(
    debouncedDocument.length >= MIN_CLIENT_DOCUMENT_LENGTH
      ? debouncedDocument
      : "",
  );

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const reset = () => {
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const amount = Number(form.requested_amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("O valor solicitado deve ser maior que 0.");
      return;
    }
    try {
      await createProposal.mutateAsync({
        client_document: form.client_document,
        product_id: form.product_id,
        operator_id: form.operator_id || undefined,
        requested_amount: amount,
      });
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar proposta");
    }
  };

  const lookupActive = debouncedDocument.length >= MIN_CLIENT_DOCUMENT_LENGTH;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        {trigger ?? (
          <>
            <FilePlus2Icon />
            Nova Proposta
          </>
        )}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Nova Proposta</Dialog.Title>
          <Dialog.Description>
            Crie uma nova proposta de crédito para um cliente.
          </Dialog.Description>
        </Dialog.Header>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
          <div className="space-y-1.5">
            <Label htmlFor="proposal-client">CPF do Cliente</Label>
            <Input
              id="proposal-client"
              value={form.client_document}
              onChange={(e) => handleChange("client_document", e.target.value)}
              required
              inputMode="numeric"
              placeholder="000.000.000-00"
            />
            {clientQuery.isFetching && lookupActive ? (
              <p className="text-xs text-muted-foreground">Buscando cliente...</p>
            ) : clientQuery.data ? (
              <p className="text-xs font-medium text-success">
                Cliente: {clientQuery.data.name}
              </p>
            ) : lookupActive && clientQuery.isError ? (
              <p className="text-xs font-medium text-danger">
                Cliente não encontrado para este CPF.
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proposal-product">Produto</Label>
            <select
              id="proposal-product"
              value={form.product_id}
              onChange={(e) => handleChange("product_id", e.target.value)}
              required
              disabled={productsLoading}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20"
            >
              <option value="" disabled>
                {productsLoading ? "Carregando produtos..." : "Selecione um produto"}
              </option>
              {(products ?? []).map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Produto de crédito a ser solicitado.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proposal-amount">Valor Solicitado</Label>
            <Input
              id="proposal-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={form.requested_amount}
              onChange={(e) => handleChange("requested_amount", e.target.value)}
              required
              placeholder="5000.00"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="proposal-operator">Operador</Label>
            <select
              id="proposal-operator"
              value={form.operator_id}
              onChange={(e) => handleChange("operator_id", e.target.value)}
              disabled={operatorsLoading}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20"
            >
              <option value="">
                {operatorsLoading ? "Carregando operadores..." : "Nenhum (opcional)"}
              </option>
              {(operators ?? []).map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operator.fullName}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
              {error}
            </div>
          )}

          <Dialog.Footer>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createProposal.isPending}>
              {createProposal.isPending ? "Criando..." : "Criar Proposta"}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog>
  );
}