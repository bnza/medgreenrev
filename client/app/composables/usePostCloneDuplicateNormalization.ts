import type { PostCollectionPath, PostCollectionRequestMap } from '~~/types'

/**
 * Generic, server-managed fields that must never be carried over from the
 * source item when duplicating: identity, audit, and JSON-LD metadata.
 */
const GENERIC_STRIP_KEYS = [
  'id',
  '@id',
  '@type',
  'createdAt',
  'updatedAt',
  'createdBy',
  'updatedBy',
  '_acl',
] as const

/**
 * Flattens top-level relation properties of an item into their IRIs.
 *
 * For each own enumerable property of `item`:
 *  - If the value is an API resource object (i.e. `isApiResourceObject(value)`
 *    is `true`, meaning it has a string `@id`),
 *  - And the property name is NOT listed in `blackList`,
 *  - Then the entry is replaced by `value['@id']` (the resource IRI).
 *
 * Properties whose value is not a resource object, or that are blacklisted,
 * are left untouched. The function does not recurse — only top-level relations
 * are flattened, which matches the API's POST request shape where embedded
 * relations are expressed as IRIs.
 *
 * The blacklist is typed as an array of `keyof PostCollectionRequestMap[P]`
 * so callers can only blacklist properties that actually exist on the
 * target resource's request type.
 *
 * @example
 *   flattenRelations<'/api/data/stratigraphic_units'>(
 *     { site: { '@id': '/api/data/archaeological_sites/3', name: 'foo' }, year: 2024 },
 *     [],
 *   )
 *   // → { site: '/api/data/archaeological_sites/3', year: 2024 }
 */
export const flattenRelations = (
  item: Record<string, unknown>,
  blackList: string[] = [],
): Record<string, unknown> => {
  const blocked = new Set(blackList as string[])
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => {
      if (blocked.has(key)) return [key, value]
      if (isApiResourceObject(value)) return [key, value['@id']]
      return [key, value]
    }),
  )
}

/**
 * Per-resource overrides applied AFTER the generic strip. Use these to clear
 * unique fields (codes, slugs), prefix titles (`"Copy of …"`), or drop child
 * relations that must not be duplicated. Empty by default — populate as
 * duplicate is enabled for each resource.
 *
 * Overrides operate on a loose `Record<string, any>` because they don't need
 * to know (or honour) the strict OpenAPI request type — the conversion to
 * `Partial<PostCollectionRequestMap[P]>` happens at the composable's public
 * boundary.
 */
const POST_CLONE_NORMALIZATION_FN_MAP: Partial<
  Record<PostCollectionPath, (item: Record<string, any>) => Record<string, any>>
> = {
  '/api/data/potteries': (item) => {
    const flattened = flattenRelations(item)
    flattened.decorations = item.decorations?.map(
      (d: { '@id': string }) => d['@id'],
    )
    return flattened
  },
}

/**
 * Returns a normalizer to be applied to an item fetched for duplication.
 * The returned function strips identity/audit/JSON-LD fields, applies any
 * per-resource override, and types the result as
 * `Partial<PostCollectionRequestMap[P]>` so downstream consumers can align
 * their emit/handler signatures with the resource's request shape.
 *
 * Mirrors `usePreCreateNormalization` (pre-POST shaping), but operates on the
 * cloned source item (post-clone, pre-form shaping).
 */
export const usePostCloneDuplicateNormalization = <
  P extends PostCollectionPath,
>(
  path: P,
) => {
  const resourceSpecific =
    POST_CLONE_NORMALIZATION_FN_MAP[path] ??
    ((item: Record<string, any>) => flattenRelations(item))
  return (item: Record<string, any>): Partial<PostCollectionRequestMap[P]> => {
    const stripped = Object.fromEntries(
      Object.entries(structuredClone(item)).filter(
        ([key]) => !(GENERIC_STRIP_KEYS as readonly string[]).includes(key),
      ),
    )
    return resourceSpecific(stripped) as Partial<PostCollectionRequestMap[P]>
  }
}

export default usePostCloneDuplicateNormalization
