import type {
  ApiResourceKey,
  GetItemPath,
  GetItemResponseMap,
  OperationPathParams,
  PatchItemPath,
  PatchItemRequestMap,
} from '~~/types'

/**
 * Type utility `NormalizeApiResourceProps` is a generic type used to transform the structure
 * of a given TypeScript type or interface. It is particularly useful for normalizing the
 * properties of objects that include `@id` references, commonly used in APIs or linked data contexts.
 *
 * This type performs the following transformations:
 * - If a property is an object containing an `@id` key of type string, it will map the property to a string.
 * - If a property is an array of objects, each containing an `@id` key, it will map the property to an array of strings.
 * - All other properties are preserved without changes.
 *
 * Usage:
 * Apply this type to objects or data types where references need to be transformed into simpler, more manageable forms,
 * such as converting nested `@id` objects or arrays of those objects into plain string identifiers.
 */
export type NormalizeApiResourceProps<T> =
  T extends Record<string, any>
    ? {
        [K in keyof T]: T[K] extends { '@id': string }
          ? string
          : T[K] extends { '@id': string }[]
            ? string[]
            : T[K]
      }
    : T

export type NormalizedGetItem<P extends GetItemPath> =
  NormalizeApiResourceProps<GetItemResponseMap[P]>

export type NormalizedPatchItem<P extends PatchItemPath> =
  NormalizeApiResourceProps<GetItemResponseMap[P]>

export function useGetPatchItemQuery<P extends GetItemPath & PatchItemPath>(
  path: P,
  params: Ref<OperationPathParams<P, 'get'> | undefined>,
  typeIriBlacklist: ApiResourceKey[] = [],
) {
  const { data, ...rest } = useGetItemQuery(path, params)

  const normalizePatchItem = (
    item: typeof data.value,
  ): NormalizedPatchItem<P> => {
    if (!item) {
      return {} as any
    }

    //Blacklist the object that has the listed @type value (PascalCase resourceKey) from being normalized as IRIs
    const blacklist = new Set<string>(
      typeIriBlacklist.map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
    )
    const normalizedItem = structuredClone(item) as any

    Object.keys(item).forEach((key) => {
      if (
        key !== '@id' &&
        isJsonLdItem(normalizedItem[key]) &&
        !blacklist.has(normalizedItem[key]['@type'])
      ) {
        normalizedItem[key] = normalizedItem[key]['@id']
      } else if (key !== '@id' && Array.isArray(normalizedItem[key])) {
        normalizedItem[key] = normalizedItem[key].map((innerItem) =>
          isApiResourceObject(innerItem) ? innerItem['@id'] : innerItem,
        )
      }
    })
    return normalizedItem
  }

  const item = computed(() =>
    data.value
      ? normalizePatchItem(data.value)
      : ({} as NormalizedPatchItem<P>),
  )

  const model = ref({}) as Ref<PatchItemRequestMap[P]>

  watch(
    item,
    (value) => {
      model.value = structuredClone(
        toRaw(value),
      ) as unknown as PatchItemRequestMap[P]
    },
    { immediate: true },
  )

  return {
    model,
    responseItem: data,
    item,
    ...rest,
  }
}
