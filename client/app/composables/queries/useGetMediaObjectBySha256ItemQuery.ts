import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'
import type { GetCollectionResponseMap } from '~~/types'

export const useGetMediaObjectBySha256ItemQuery = () => {
  const sha256 = ref<string>('')
  const getCollectionOperation = new GetCollectionOperation(
    '/api/data/media_objects',
  )

  const { data: _data, ...query } = useQuery({
    key: ['sha256', sha256.value],
    query: () =>
      getCollectionOperation.request({ query: { sha256: sha256.value } }),
    enabled: () => Boolean(sha256.value),
  })

  const data = computed(
    () =>
      _data.value?.member?.[0] as
        | GetCollectionResponseMap['/api/data/media_objects']['member'][0]
        | undefined,
  )
  return {
    data,
    ...query,
    sha256,
  }
}

export default useGetMediaObjectBySha256ItemQuery
