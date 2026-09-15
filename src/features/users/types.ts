export interface CreateUserInput {
  name: string
  email: string
  password: string
  role_ids?: string[]
}

export type UpdateUserInput = Partial<CreateUserInput> & {
  is_active?: boolean
}
