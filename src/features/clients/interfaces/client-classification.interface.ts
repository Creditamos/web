export type ClientPersonType = "INDIVIDUAL" | "CORPORATE"

export interface ClientSubclassRef {
  id: string
  code: string
  name: string
  allowedPersonTypes: ClientPersonType[]
}

export interface ClientClassRef {
  id: string
  code: string
  name: string
  allowedPersonTypes: ClientPersonType[]
  subclasses: ClientSubclassRef[]
}

export interface ClientSubgroupRef {
  id: string
  code: string
  name: string
}

export interface ClientGroupRef {
  id: string
  code: string
  name: string
  subgroups: ClientSubgroupRef[]
}

export interface ClientClassifications {
  classes: ClientClassRef[]
  groups: ClientGroupRef[]
}
