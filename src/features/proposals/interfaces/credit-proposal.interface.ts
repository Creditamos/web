export type ProposalStatusEnum = "PENDING" | "REVIEW" | "APPROVED" | "REJECTED" | "CANCELLED"

/**
 * Propostas retornam entidades cruas (não DTOs mascarados) com relacionamentos
 * aninhados populados. As chaves que o frontend consume de fato são os campos
 * escalares abaixo; as relações não populadas podem vir como id, objeto ou ficar
 * ausentes — por isso os helpers de leitura em `proposal-status.ts` tratam as
 * variações de serialização.
 */
export interface ProposalClassificationRef {
  id: string
  name?: string
}

export interface ProposalNameRef extends ProposalClassificationRef {}

export interface ProposalClient {
  id: string
  code: string
  name: string
  personType?: string
  documentNumber?: string
  phone?: string | null
  isActive?: boolean
  headquarters?: string | ProposalNameRef | null
  masterAgent?: string | ProposalNameRef | null
  createdAt?: string
}

export interface ProposalProduct {
  id: string
  code: string
  name: string
  supplier?: string | ProposalNameRef | null
  class?: string | ProposalNameRef | null
  subclass?: string | ProposalNameRef | null
  clientTypes?: string[]
  isActive?: boolean
  createdAt?: string
}

export interface ProposalOperator {
  id: string
  code?: string
  fullName?: string
  cpf?: string
  email?: string | null
  supplier?: string | ProposalNameRef | null
}

export interface CreditProposal {
  id: string
  client: ProposalClient
  product: ProposalProduct
  operator?: ProposalOperator | null
  requestedAmount: string
  preApprovedLimit?: string | null
  status: ProposalStatusEnum
  externalKey?: string | null
  createdAt: string
  updatedAt: string
}

export const PROPOSAL_STATUSES: ProposalStatusEnum[] = [
  "PENDING",
  "REVIEW",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]

export function isProposalStatus(value: string): value is ProposalStatusEnum {
  return (PROPOSAL_STATUSES as string[]).includes(value)
}

function readableName(value: string | ProposalNameRef | null | undefined): string | null {
  if (typeof value === "string") return value
  if (value && typeof value === "object") return value.name ?? null
  return null
}

export function proposalClientName(proposal: Pick<CreditProposal, "client">): string {
  return proposal.client?.name ?? "—"
}

export function proposalClientDocument(proposal: Pick<CreditProposal, "client">): string | null {
  return proposal.client?.documentNumber ?? null
}

export function proposalProductName(proposal: Pick<CreditProposal, "product">): string {
  return proposal.product?.name ?? "—"
}

export function proposalSupplierName(proposal: Pick<CreditProposal, "product">): string | null {
  return readableName(proposal.product?.supplier)
}

export function proposalClassName(proposal: Pick<CreditProposal, "product">): string | null {
  return readableName(proposal.product?.class)
}

export function proposalOperatorName(proposal: Pick<CreditProposal, "operator">): string | null {
  return proposal.operator?.fullName ?? null
}
