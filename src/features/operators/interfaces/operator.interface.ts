export interface Operator {
  id: string
  supplier: string | null
  code: string
  fullName: string
  cpf: string
  email: string | null
  isActive: boolean
  createdAt: string
}
