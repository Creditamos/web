export type ProductClientType = "INDIVIDUAL" | "CORPORATE"

export interface CreditProduct {
  id: string
  supplier: string | null
  code: string
  name: string
  class: string | null
  subclass: string | null
  clientTypes: ProductClientType[]
  isActive: boolean
  createdAt: string
}
