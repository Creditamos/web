import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Supplier } from "../interfaces"
import type { SupplierSubmitValues } from "../types"

function createSupplier(input: SupplierSubmitValues): Promise<Supplier> {
  return api.post<Supplier>("/suppliers", input).then((res) => res.data)
}

export type CreateSupplierMutationResult = UseMutationResult<Supplier, Error, SupplierSubmitValues>

export function useCreateSupplier(): CreateSupplierMutationResult {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
