export interface JsonLdItem extends Record<string, unknown> {
  '@id': Iri
  '@type': string
}

export interface JsonLdDocument extends JsonLdItem {
  '@context': string | Record<string, string>
}

export interface HydraMember<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends JsonLdItem,
    T {}

export interface HydraView extends JsonLdItem {
  '@id': string
  first?: string
  last?: string
  next?: string
  previous?: string
}

export interface HydraCollection<T extends JsonLdItem = HydraMember>
  extends JsonLdItem {
  member: T[]
  totalItems: number
  view?: HydraView
}
