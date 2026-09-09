export interface ClientClassificationRef {
  id: string
  code: string
  name: string
}

export interface Client {
  id: string
  code: string
  headquarters: string | null
  masterAgent: string | null
  class: ClientClassificationRef | null
  subclass: ClientClassificationRef | null
  group: ClientClassificationRef | null
  subgroup: ClientClassificationRef | null
  personType: string
  documentNumber: string
  name: string
  phone: string | null
  bankCode: string | null
  agency: string | null
  account: string | null
  accountDigit: string | null
  accountType: string | null
  frontDocumentUrl: string | null
  backDocumentUrl: string | null
  isActive: boolean
  createdAt: string
}
