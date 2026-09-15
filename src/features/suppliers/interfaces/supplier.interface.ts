export interface SupplierClassRef {
  id: string
  code: string
  name: string
}

export interface Supplier {
  id: string
  code: string
  name: string
  class: SupplierClassRef | null
  subclass: SupplierClassRef | null
  isActive: boolean
  createdAt: string
}

export interface SupplierClass {
  id: string
  code: string
  name: string
  subclasses: SupplierClassRef[]
}
