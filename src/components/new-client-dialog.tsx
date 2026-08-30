"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useCreateClient } from "@/features/clients";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";

interface NewClientDialogProps {
  trigger?: React.ReactNode;
}

const CLIENT_CATEGORIES = [
  { value: "MASTER_AGENT", label: "Master Agent" },
  { value: "RESELLER", label: "Revendedor (Reseller)" },
];

const emptyForm = {
  category: "",
  subcategory: "",
  person_type: "INDIVIDUAL",
  document_number: "",
  name: "",
  phone: "",
};

export function NewClientDialog({ trigger }: NewClientDialogProps) {
  const createClient = useCreateClient();
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const handleChange: (field: keyof typeof emptyForm, value: string) => void = (field: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const reset: VoidFunction = () => {
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await createClient.mutateAsync({
        category: form.category,
        person_type:
          form.person_type === "CORPORATE" ? "CORPORATE" : "INDIVIDUAL",
        document_number: form.document_number,
        name: form.name,
        subcategory: form.subcategory || undefined,
        phone: form.phone || undefined,
      });
      reset();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao criar cliente");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
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
          <Dialog.Description>
            Crie um novo registro de cliente na carteira.
          </Dialog.Description>
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
                onChange={(e  ) => handleChange("person_type", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <option value="INDIVIDUAL">Pessoa Física</option>
                <option value="CORPORATE">Pessoa Jurídica</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="client-category">Categoria</Label>
              <select
                id="client-category"
                value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
              >
                <option value="" disabled>
                  Selecione uma categoria
                </option>
                {CLIENT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="client-subcategory">Subcategoria</Label>
            <Input
              id="client-subcategory"
              value={form.subcategory}
              onChange={(e) => handleChange("subcategory", e.target.value)}
              placeholder="Opcional"
            />
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
            <Button
              type="submit"
              disabled={createClient.isPending}
            >
              {createClient.isPending ? "Criando..." : "Criar Cliente"}
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog>
  );
}
