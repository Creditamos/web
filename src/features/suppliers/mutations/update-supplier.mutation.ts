import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Supplier } from "../interfaces"
import type { SupplierSubmitValues } from "../types"

interface UpdateSupplierVariables {
  id: string
  input: SupplierSubmitValues & { is_active?: boolean }
}

function updateSupplier({ id, input }: UpdateSupplierVariables): Promise<Supplier> {
  return api.put<Supplier>(`/suppliers/${id}`, input).then((res) => res.data)
}

export type UpdateSupplierMutationResult = UseMutationResult<
  Supplier,
  Error,
  UpdateSupplierVariables
>

export function useUpdateSupplier(): UpdateSupplierMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: updateSupplier,
    onSuccess: (_supplier, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["suppliers", id] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
