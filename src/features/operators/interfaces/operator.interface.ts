export interface Operator {
  id: string;
  supplier: string | null;
  fullName: string;
  documentNumber: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
}