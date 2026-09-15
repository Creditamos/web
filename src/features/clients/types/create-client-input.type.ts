import type { ClientPersonType } from "../interfaces/client-classification.interface"

export type ClientAccountType = "CHECKING" | "SAVINGS"

export type CreateClientInput = {
  headquarters_id?: string
  master_agent_id?: string
  class_id?: string
  subclass_id?: string
  group_id?: string
  subgroup_id?: string
  person_type: ClientPersonType
  document_number: string
  name: string
  phone?: string
  bank_code?: string
  agency?: string
  account?: string
  account_digit?: string
  account_type?: ClientAccountType
  front_document_url?: string
  back_document_url?: string
}

export type UpdateClientInput = Partial<CreateClientInput> & {
  is_active?: boolean
}
