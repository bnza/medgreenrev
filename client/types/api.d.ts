import type { HTTPMethod } from 'h3'

export type ApiHttpMethod = Exclude<
  Lowercase<HTTPMethod>,
  'trace',
  'put',
  'head',
  'options'
>

export type ApiRequestOptions = Parameters<typeof $fetch>[1]

export type BaseAcl = {
  canRead: boolean
  canUpdate: boolean
  canDelete: boolean
}

export type CollectionAcl = {
  canCreate: boolean
  canExport: boolean
}

export interface ApiAclResource {
  _acl: BaseAcl
}

export type UserBaseData = {
  id: string
  email: string
}

type Iri = string & { readonly __brand: 'Iri' }
