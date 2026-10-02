import { type UseQueryResult, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { Organization } from "../interfaces/organization.interface"

function fetchOrganizations(): Promise<Organization[]> {
  return api.get<Organization[]>("/organizations").then((res) => res.data)
}

export type FetchOrganizationsQueryResult = UseQueryResult<Organization[], Error>

export function useOrganizations(): FetchOrganizationsQueryResult {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
  })
}
