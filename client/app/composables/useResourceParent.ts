import type { ApiResourceItemPath } from '~/utils/consts/resources'
import type { ResourceParent } from '~~/types'

export const useResourceParent = <
  K extends string,
  P extends ApiResourceItemPath,
>(
  resourceParent?: ResourceParent<K, P>,
) => {
  const key = computed(() => resourceParent?.key)
  const path = computed(() => resourceParent?.resourceItemPath)
  const item = computed(() => resourceParent?.item)
  const id = computed(() =>
    isPlainObject(item.value) && 'id' in item.value
      ? String(item.value.id)
      : undefined,
  )
  const iri = computed(() =>
    isPlainObject(item.value) && '@id' in item.value
      ? String(item.value['@id'])
      : undefined,
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
