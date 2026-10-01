export type CreateProposalInput = {
  client_document: string
  product_id: string
  operator_id?: string
  requested_amount: number
  accepted_term: boolean
  responsible_name?: string
  responsible_phone?: string
}
