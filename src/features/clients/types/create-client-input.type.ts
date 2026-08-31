export type CreateClientInput = {
  headquarters_id?: string
  master_agent_id?: string
  category: string
  subcategory?: string
  person_type: "INDIVIDUAL" | "CORPORATE"
  document_number: string
  name: string
  phone?: string
}
