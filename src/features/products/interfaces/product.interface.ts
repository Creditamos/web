export interface CreditProduct {
  id: string
  supplier: string | null
  code: string
  name: string
  class: string | null
  subclass: string | null
  clientTypes: string[]
  isActive: boolean
  createdAt: string
}
