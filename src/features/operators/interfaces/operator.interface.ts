export interface OperatorSupplierRef {
  id: string
  code: string
  name: string
}

export interface Operator {
  id: string
  supplier: OperatorSupplierRef | null
  code: string
  fullName: string
  cpf: string
  rg: string | null
  birthDate: string | null
  phone: string | null
  email: string | null
  isActive: boolean
  createdAt: string
}
