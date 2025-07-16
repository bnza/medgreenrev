import type { ApiResourceItemPath } from '~/utils/consts/resources'
import type { ResourceParent } from '~~/types'

export const useResourceParent = <
  K extends string,
  P extends ApiResourceItemPath,
>(
  resourceParent?: ResourceParent<K, P>,
) => {
  const _parentTuple = resourceParent
  const key = computed(() => _parentTuple?.[0])
  const item = computed(() => _parentTuple?.[2])
  const id = computed(() =>
    item.value && 'id' in item.value ? String(item.value.id) : undefined,
  )
  const iri = computed(() =>
    item.value && 'iri' in item.value ? String(item.value.iri) : undefined,
  )

  return {
    key,
    item,
    id,
    iri,
  }
}

export default useResourceParent
