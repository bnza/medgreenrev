import type { GetFeatureCollectionPath } from '~~/types'
import useAppQueryCache from './useAppQueryCache'
import useCollectionQueryStore from '~/stores/useCollectionQueryStore'
import { GetFeatureCollectionOperation } from '~/api/operations/GetFeatureCollectionOperation'
import type { Extent } from 'ol/extent'
import type { ProjectionLike } from 'ol/proj'
import { useMapVectorApiStore } from '~/stores/useMapVectorApiStore'

export function useGetFeatureCollectionQuery(
  path: GetFeatureCollectionPath,
  bbox: Ref<Extent | undefined>,
  projection: Ref<ProjectionLike>,
) {
  const getFeatureCollectionOperation = new GetFeatureCollectionOperation(path)
  const mapVectorApiStore = useMapVectorApiStore(path)

  if (!mapVectorApiStore.resourceConfig) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const { RESOURCE_QUERY_KEY } = useAppQueryCache(
    mapVectorApiStore.resourcePath,
    path,
  )

  // The composable uses the resourceConfig to sync the fetch with tha actual filtered endpoint
  const { filterQueryObject } = storeToRefs(
    useCollectionQueryStore(mapVectorApiStore.resourceConfig.apiPath),
  )

  const _projection = computed(() =>
    typeof projection.value === 'string'
      ? projection.value
      : (projection.value?.getCode() ?? undefined),
  )

  const bboxQueryObject = computed(() =>
    bbox.value
      ? {
          bbox: [...bbox.value, _projection.value].filter(Boolean).join(','),
        }
      : {},
  )

  const featureQuery = defineQueryOptions(({ queryObject, bboxObject }) => ({
    key: RESOURCE_QUERY_KEY.byFilter({
      ...queryObject,
      ...bboxObject,
    }),
    query: () =>
      getFeatureCollectionOperation.request({
        query: { ...queryObject, ...bboxObject },
      }),
  }))

  return useQuery(featureQuery, () => ({
    queryObject: filterQueryObject.value,
    bboxObject: bboxQueryObject.value,
  }))
}

export default useGetFeatureCollectionQuery
