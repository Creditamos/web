export interface Scope {
  id: string
  name: string
  description: string | null
}

export interface Role {
  id: string
  name: string
  description: string | null
  isActive: boolean
  scopes: Scope[]
  userCount: number
  createdAt: string
  updatedAt: string
}
