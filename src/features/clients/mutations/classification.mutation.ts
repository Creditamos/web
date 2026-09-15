import {
  type QueryClient,
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type {
  ClientClassRef,
  ClientGroupRef,
  ClientSubclassRef,
  ClientSubgroupRef,
} from "../interfaces/client-classification.interface"

export type ClassificationKind = "class" | "subclass" | "group" | "subgroup"

export interface ClassificationSubmitValues {
  code: string
  name: string
  allowed_person_types?: Array<"INDIVIDUAL" | "CORPORATE">
}

export type ClassificationItem =
  | ClientClassRef
  | ClientSubclassRef
  | ClientGroupRef
  | ClientSubgroupRef

interface CreateClassificationVariables {
  kind: ClassificationKind
  parentId?: string
  input: ClassificationSubmitValues
}

interface MutateClassificationVariables {
  kind: ClassificationKind
  id: string
  input: Partial<ClassificationSubmitValues> & { is_active?: boolean }
}

function createPath(kind: ClassificationKind, parentId?: string): string {
  switch (kind) {
    case "class":
      return "/clients/classifications/classes"
    case "subclass":
      return `/clients/classifications/${parentId}/subclasses`
    case "group":
      return "/clients/classifications/groups"
    case "subgroup":
      return `/clients/classifications/${parentId}/subgroups`
  }
}

function updatePath(kind: ClassificationKind): string {
  switch (kind) {
    case "class":
      return "/clients/classifications/classes"
    case "subclass":
      return "/clients/classifications/subclasses"
    case "group":
      return "/clients/classifications/groups"
    case "subgroup":
      return "/clients/classifications/subgroups"
  }
}

function createClassification({
  kind,
  parentId,
  input,
}: CreateClassificationVariables): Promise<ClassificationItem> {
  return api.post<ClassificationItem>(createPath(kind, parentId), input).then((res) => res.data)
}

function updateClassification({
  kind,
  id,
  input,
}: MutateClassificationVariables): Promise<ClassificationItem> {
  return api.put<ClassificationItem>(`${updatePath(kind)}/${id}`, input).then((res) => res.data)
}

function deleteClassification({
  kind,
  id,
}: {
  kind: ClassificationKind
  id: string
}): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`${updatePath(kind)}/${id}`).then((res) => res.data)
}

function invalidateClassifications(queryClient: QueryClient): void {
  queryClient.invalidateQueries({ queryKey: ["clients", "classifications"] })
}

export type UseCreateClassificationMutation = UseMutationResult<
  ClassificationItem,
  Error,
  CreateClassificationVariables
>

export function useCreateClassification(): UseCreateClassificationMutation {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: createClassification,
    onSuccess: () => invalidateClassifications(queryClient),
  })
}

export type UseUpdateClassificationMutation = UseMutationResult<
  ClassificationItem,
  Error,
  MutateClassificationVariables
>

export function useUpdateClassification(): UseUpdateClassificationMutation {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: updateClassification,
    onSuccess: () => invalidateClassifications(queryClient),
  })
}

export type UseDeleteClassificationMutation = UseMutationResult<
  { message: string },
  Error,
  { kind: ClassificationKind; id: string }
>

export function useDeleteClassification(): UseDeleteClassificationMutation {
  const queryClient: QueryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteClassification,
    onSuccess: () => invalidateClassifications(queryClient),
  })
}
