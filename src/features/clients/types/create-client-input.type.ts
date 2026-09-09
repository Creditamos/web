import type { ClientPersonType } from "../interfaces/client-classification.interface"

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
}
