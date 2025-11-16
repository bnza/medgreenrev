import type {
  ApiResourceKey,
  GetItemPath,
  GetItemResponseMap,
  PatchItemPath,
  PatchItemRequestMap,
} from '~~/types'

type NormalizedPatchItem<P extends GetItemPath & PatchItemPath> = (
  item: Ref<GetItemResponseMap[P] | undefined>,
  typeIriBlacklist?: ApiResourceKey[],
) => PatchItemRequestMap[P] | undefined
export const baseNormalizePatchItem = <P extends GetItemPath & PatchItemPath>(
  item: Ref<GetItemResponseMap[P] | undefined>,
  typeIriBlacklist: ApiResourceKey[] = [],
): PatchItemRequestMap[P] | undefined => {
  if (!item.value) {
    return
  }

  //Blacklist the object that has the listed @type value (PascalCase resourceKey) from being normalized as IRIs
  const blacklist = new Set<string>(
    typeIriBlacklist.map((key) => key.charAt(0).toUpperCase() + key.slice(1)),
  )
  const normalizedItem = structuredClone(item.value) as any

  Object.keys(item.value).forEach((key) => {
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

export const useUpdateDialog = <P extends GetItemPath & PatchItemPath>(
  path: P,
  normalizePatchItem: NormalizedPatchItem<P> = baseNormalizePatchItem,
) => {
  const { updateDialogState } = storeToRefs(useResourceUpdateDialogStore(path))

  const { data } = useGetItemQuery(path, updateDialogState)

  const initialValue = computed(() => normalizePatchItem(data))

  const fetchedItem = computed(() => data.value)

  return {
    fetchedItem,
    updateDialogState,
    initialValue,
  }
}
