"use client";

import { useState } from "react";
import { FetchProposalsQueryResult, useProposals } from "@/features/proposals";

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  REVIEW: "Em análise",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-danger/10 text-danger",
  REVIEW: "bg-primary/10 text-primary",
};

export default function ProposalsPage() {
  const [filter, setFilter] = useState<string>("");
  const { data: proposals, isLoading, error }: FetchProposalsQueryResult = useProposals(filter || undefined);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Propostas</h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe e gerencie as propostas de crédito.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm dark:bg-secondary"
          >
            <option value="">Todos os Status</option>
            <option value="PENDING">Pendente</option>
            <option value="APPROVED">Aprovado</option>
            <option value="REJECTED">Rejeitado</option>
            <option value="REVIEW">Em análise</option>
          </select>
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

      {!isLoading && !error && proposals && proposals.length === 0 && (
        <div className="rounded-xl border border-border bg-white p-12 text-center dark:bg-secondary">
          <p className="text-muted-foreground">Nenhuma proposta encontrada.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Conecte-se à API do backend para carregar os dados das propostas.
          </p>
        </div>
      )}

      {!isLoading && proposals && proposals.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm dark:bg-secondary">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Produto</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Criada em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {proposals.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{p.id.slice(0, 8)}...</td>
                  <td className="px-4 py-3">{p.client?.name ?? "—"}</td>
                  <td className="px-4 py-3">{p.product?.name ?? "—"}</td>
                  <td className="px-4 py-3 font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(p.requestedAmount))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        statusColors[p.status] ?? "bg-muted text-muted-foreground"
                      }`}
                    >
                      {statusLabels[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString("pt-BR")}
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
