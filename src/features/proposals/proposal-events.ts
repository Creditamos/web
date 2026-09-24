import type { ProposalEvent, ProposalEventType } from "./interfaces/credit-proposal.interface"

export const PROPOSAL_EVENT_LABELS: Record<ProposalEventType, string> = {
  PROPOSAL_CREATED: "Proposta registrada (WhatsApp)",
  ACCEPTANCE_SENT: "Link de aceite enviado ao cliente",
  CLIENT_ACCEPTED: "Cliente aceitou a proposta",
  CLIENT_DECLINED: "Cliente recusou a proposta",
  SUBMITTED_TO_PORTAL: "Enviada para pré-análise do portal",
  PORTAL_RESPONSE: "Resposta do portal do banco",
  OPERATOR_ASSIGNED: "Operador regional designado",
  OPERATOR_DECISION: "Decisão do operador registrada",
  STATUS_CHANGED: "Status alterado",
}

export function proposalEventLabel(eventType: string): string {
  return PROPOSAL_EVENT_LABELS[eventType as ProposalEventType] ?? eventType
}

function textValue(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

/**
 * Resumo legível do payload de um evento (decisão do portal, operador
 * designado, resultado do operador, etc.). Usa apenas dados destruturáveis
 * para consumo no painel.
 */
export function proposalEventSummary(event: ProposalEvent): string | null {
  const payload = event.payload
  if (!payload) return null

  switch (event.type) {
    case "PORTAL_RESPONSE": {
      const decision = textValue(payload.decision)
      const reference = textValue(payload.reference)
      if (decision && reference) return `${decision} · ${reference}`
      return decision ?? reference
    }
    case "OPERATOR_ASSIGNED": {
      const name = textValue(payload.operatorName)
      const region = textValue(payload.region)
      if (name && region) return `${name} (${region})`
      return name
    }
    case "OPERATOR_DECISION": {
      const decision = textValue(payload.decision)
      const operatorId = textValue(payload.operatorId)
      if (decision && !operatorId) return decision
      return decision ?? null
    }
    case "ACCEPTANCE_SENT": {
      const channel = textValue(payload.channel)
      return channel ? `Canal: ${channel}` : null
    }
    case "SUBMITTED_TO_PORTAL": {
      return textValue(payload.reference)
    }
    default:
      return null
  }
}
