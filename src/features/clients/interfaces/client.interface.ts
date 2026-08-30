export interface ClientReference {
  id: string;
  category?: string | null;
  name?: string | null;
}

export interface Client {
  id: string;
  headquarters: string | null;
  masterAgent: string | null;
  category: string;
  subcategory: string | null;
  personType: string;
  documentNumber: string;
  name: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
}
