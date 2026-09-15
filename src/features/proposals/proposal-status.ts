import type { Scope } from "@/lib/scopes"
import type { ProposalStatusEnum } from "./interfaces/credit-proposal.interface"

export type StatusTone = "success" | "warning" | "danger" | "info" | "muted"

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatusEnum, string> = {
  PENDING: "Pendente",
  REVIEW: "Em análise",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  CANCELLED: "Cancelado",
}

export const PROPOSAL_STATUS_TONES: Record<ProposalStatusEnum, StatusTone> = {
  PENDING: "warning",
  REVIEW: "info",
  APPROVED: "success",
  REJECTED: "danger",
  CANCELLED: "muted",
}

/**
 * Máquina de estados espelhada no value object `ProposalStatus` do backend
 * (src/value-objects/proposal-status.vo.ts). Transições para fora desta tabela
 * são rejeitadas pelo backend com 409.
 */
export const PROPOSAL_TRANSITIONS: Record<ProposalStatusEnum, ProposalStatusEnum[]> = {
  PENDING: ["REVIEW", "APPROVED", "REJECTED", "CANCELLED"],
  REVIEW: ["APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["CANCELLED"],
  REJECTED: [],
  CANCELLED: [],
}

export const PROPOSAL_TRANSITION_LABELS: Partial<Record<ProposalStatusEnum, string>> = {
  REVIEW: "Enviar para análise",
  APPROVED: "Aprovar",
  REJECTED: "Rejeitar",
  CANCELLED: "Cancelar",
}

export function proposalTransitions(status: ProposalStatusEnum): ProposalStatusEnum[] {
  return PROPOSAL_TRANSITIONS[status] ?? []
}

export function proposalTransitionScope(next: ProposalStatusEnum): Scope {
  switch (next) {
    case "APPROVED":
      return "proposals:approve"
    case "REJECTED":
      return "proposals:reject"
    default:
      return "proposals:update"
  }
}
