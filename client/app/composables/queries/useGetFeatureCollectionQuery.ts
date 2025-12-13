import type { GetFeatureCollectionPath } from '~~/types'
import useAppQueryCache from './useAppQueryCache'
import useCollectionQueryStore from '~/stores/useCollectionQueryStore'
import { GetFeatureCollectionOperation } from '~/api/operations/GetFeatureCollectionOperation'
import type { Extent } from 'ol/extent'
import type { ProjectionLike } from 'ol/proj'

export function useGetFeatureCollectionQuery(
  path: GetFeatureCollectionPath,
  bbox: Ref<Extent | undefined>,
  projection: Ref<ProjectionLike>,
) {
  const getCollectionOperation = new GetFeatureCollectionOperation(path)

  const openApiStore = useOpenApiStore()
  const apiResourcePath = openApiStore.findApiResourcePath(path)
  if (!apiResourcePath) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const { RESOURCE_QUERY_KEY } = useAppQueryCache(apiResourcePath, path)

  const { queryObject } = storeToRefs(useCollectionQueryStore(apiResourcePath))

  const _projection = computed(() =>
    typeof projection.value === 'string'
      ? projection.value
      : (projection.value?.getCode() ?? undefined),
  )

  const _bbox = computed(() =>
    bbox.value
      ? {
          bbox: [...bbox.value, _projection.value].filter(Boolean).join(','),
        }
      : {},
  )

  const key = computed(() =>
    RESOURCE_QUERY_KEY.byFilter({
      ...queryObject.value,
      ..._bbox.value,
    }),
  )

  return useQuery({
    key: () => key.value,
    query: () =>
      getCollectionOperation.request({
        query: { ...queryObject.value, ..._bbox.value },
      }),
  })
}

export default useGetFeatureCollectionQuery
