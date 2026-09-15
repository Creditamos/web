export interface User {
  id: string
  name: string
  email: string
  roleIds: string[]
  roleNames: string[]
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}
