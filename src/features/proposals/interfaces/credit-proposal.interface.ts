import type { Client } from "@/features/clients"
import type { CreditProduct } from "@/features/products"

export type { CreditProduct }

export interface CreditProposal {
  id: string
  client: Client
  product: CreditProduct
  operator: unknown | null
  requestedAmount: string
  status: string
  createdAt: string
  updatedAt: string
}
