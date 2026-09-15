export interface CreateRoleInput {
  name: string
  description?: string
  scope_ids?: string[]
}

export type UpdateRoleInput = Partial<CreateRoleInput> & {
  is_active?: boolean
}
