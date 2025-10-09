import type { ResourceParent, ApiResourceKey, Iri, GetItemPath } from '~~/types'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'

export const useResourceParent = <K extends ApiResourceKey>(
  resourceParent?: ResourceParent<K>,
) => {
  const key = computed(() => resourceParent?.key)
  const path = computed<GetItemPath | undefined>(() =>
    resourceParent?.key
      ? `${API_RESOURCE_MAP[resourceParent.key]}/{id}`
      : undefined,
  )

  const item = computed(() => resourceParent?.item)

  const iri = computed(() =>
    isJsonLdItem(item.value) ? (item.value['@id'] as string) : undefined,
  )

  const id = computed(() =>
    iri.value ? extractIdFromIri(iri.value as Iri) : undefined,
  )

  return {
    key,
    path,
    item,
    id,
    iri,
  }
}

export default useResourceParent
