export type ProductClientType = "INDIVIDUAL" | "CORPORATE"

export interface CreditProduct {
  id: string
  supplier: string | null
  supplierId?: string | null
  code: string
  name: string
  class: string | null
  classId?: string | null
  subclass: string | null
  subclassId?: string | null
  clientTypes: ProductClientType[]
  isActive: boolean
  createdAt: string
}

export interface ProductSubclass {
  id: string
  code: string
  name: string
}

export interface ProductClass {
  id: string
  code: string
  name: string
  subclasses: ProductSubclass[]
}

export interface CreateProductInput {
  code: string
  name: string
  supplier_id: string
  class_id: string
  subclass_id?: string | null
  client_types?: ProductClientType[]
}

export interface UpdateProductInput {
  code?: string
  name?: string
  supplier_id?: string
  class_id?: string
  subclass_id?: string | null
  client_types?: ProductClientType[]
  is_active?: boolean
}
