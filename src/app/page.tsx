"use client";

import { UsersIcon, FileTextIcon, CheckCircle2Icon, ClockIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WhatsappStatusCard } from "@/components/whatsapp-status-card";
import { NewClientDialog } from "@/components/new-client-dialog";
import { NewProposalDialog } from "@/components/new-proposal-dialog";
import { Client, FetchClientsQueryResult, useClients } from "@/features/clients";
import { CreditProposal, FetchProposalsQueryResult, useProposals } from "@/features/proposals";
import { JSX } from "react";

const currency: Intl.NumberFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

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

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  sub?: string;
}

function MetricCard({ label, value, icon: Icon, sub }: MetricCardProps): JSX.Element {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm dark:bg-secondary">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default function DashboardPage(): JSX.Element {
  const { data: clients, isLoading: clientsLoading }: FetchClientsQueryResult = useClients();
  const { data: proposals, isLoading: proposalsLoading }: FetchProposalsQueryResult = useProposals();

  const activeClients: number = clients?.filter((c) => c.isActive).length ?? 0;
  const approved: CreditProposal[] = proposals?.filter((p) => p.status === "APPROVED") ?? [];
  const approvedLimit: number = approved.reduce(
    (sum: number, p: CreditProposal) => sum + Number(p.requestedAmount),
    0,
  );
  const pending: number = proposals?.filter((p) => p.status === "PENDING").length ?? 0;

  const recentClients: Client[] = clients?.slice(0, 5) ?? [];
  const recentProposals: CreditProposal[] = proposals?.slice(0, 5) ?? [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
          <p className="mt-1 text-muted-foreground">
            Visão geral das suas operações de crédito.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <NewClientDialog />
          <NewProposalDialog />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total de Propostas"
          value={clientsLoading ? "--" : String(proposals?.length ?? 0)}
          icon={FileTextIcon}
          sub="Todas as propostas enviadas"
        />
        <MetricCard
          label="Clientes Ativos"
          value={clientsLoading ? "--" : String(activeClients)}
          icon={UsersIcon}
          sub="Atualmente ativos"
        />
        <MetricCard
          label="Limite de Crédito Aprovado"
          value={proposalsLoading ? "--" : currency.format(approvedLimit)}
          icon={CheckCircle2Icon}
          sub={`${approved.length} aprovadas`}
        />
        <MetricCard
          label="Propostas Pendentes"
          value={proposalsLoading ? "--" : String(pending)}
          icon={ClockIcon}
          sub="Aguardando decisão"
        />
      </div>

      <WhatsappStatusCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProposalsTable
          proposals={recentProposals}
          loading={proposalsLoading}
        />
        <RecentClientsTable clients={recentClients} loading={clientsLoading} />
      </div>
    </div>
  );
}

interface RecentProposalsTableProps {
  proposals: Array<import("@/features/proposals").CreditProposal>;
  loading: boolean;
}

function RecentProposalsTable({ proposals, loading }: RecentProposalsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm dark:bg-secondary">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Propostas Recentes</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : proposals.length === 0 ? (
        <div className="flex items-center justify-center rounded-none border-0 py-14 text-sm text-muted-foreground">
          Nenhuma proposta ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Criada em</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {proposals.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-3 font-mono text-xs">
                    {p.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-3 font-medium">
                    {currency.format(Number(p.requestedAmount))}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[p.status] ?? "bg-muted text-muted-foreground"
                        }`}
                    >
                      {statusLabels[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
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

interface RecentClientsTableProps {
  clients: Array<import("@/features/clients").Client>;
  loading: boolean;
}

function RecentClientsTable({ clients, loading }: RecentClientsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm dark:bg-secondary">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Clientes Recentes</h2>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : clients.length === 0 ? (
        <div className="flex items-center justify-center rounded-none border-0 py-14 text-sm text-muted-foreground">
          Nenhum cliente ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 font-medium">Nome</th>
                <th className="px-6 py-3 font-medium">Documento</th>
                <th className="px-6 py-3 font-medium">Tipo</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-6 py-3 font-medium">{client.name}</td>
                  <td className="px-6 py-3 font-mono text-xs">
                    {client.documentNumber}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {client.personType === "CORPORATE" ? "Jurídica" : "Física"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
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
