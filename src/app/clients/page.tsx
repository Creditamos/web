"use client";

import { FetchClientsQueryResult, useClients } from "@/features/clients";

export default function ClientsPage() {
  const { data: clients, isLoading, error }: FetchClientsQueryResult = useClients();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie a sua carteira de clientes.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-xl border border-border bg-white py-24 dark:bg-secondary">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          {error.message}
        </div>
      )}

      {!isLoading && !error && clients && clients.length === 0 && (
        <div className="rounded-xl border border-border bg-white p-12 text-center dark:bg-secondary">
          <p className="text-muted-foreground">Nenhum cliente encontrado.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Conecte-se à API do backend para carregar os dados dos clientes.
          </p>
        </div>
      )}

      {!isLoading && clients && clients.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm dark:bg-secondary">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Documento</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr key={client.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{client.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{client.documentNumber}</td>
                  <td className="px-4 py-3">{client.category ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {client.personType === "CORPORATE" ? "Jurídica" : "Física"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{client.phone ?? "--"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${client.isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {client.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
