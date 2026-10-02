export interface Organization {
  id: string
  name: string
  document: string // CNPJ
  email?: string
  phone?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
