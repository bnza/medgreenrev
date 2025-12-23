import type { GetFeatureCollectionPath } from '~~/types'
import useAppQueryCache from './useAppQueryCache'
import useCollectionQueryStore from '~/stores/useCollectionQueryStore'
import { GetFeatureCollectionOperation } from '~/api/operations/GetFeatureCollectionOperation'
import type { Extent } from 'ol/extent'
import type { ProjectionLike } from 'ol/proj'
import { API_FEATURES_RESOURCE_MAP } from '~/utils/consts/resources'

export function useGetFeatureCollectionQuery(
  path: GetFeatureCollectionPath,
  bbox: Ref<Extent | undefined>,
  projection: Ref<ProjectionLike>,
) {
  const getFeatureCollectionOperation = new GetFeatureCollectionOperation(path)
  const getCollectionPath = API_FEATURES_RESOURCE_MAP[path]

  const openApiStore = useOpenApiStore()
  const apiResourcePath = openApiStore.findApiResourcePath(path)

  if (!apiResourcePath) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const { RESOURCE_QUERY_KEY } = useAppQueryCache(apiResourcePath, path)

  const { filterQueryObject } = storeToRefs(
    useCollectionQueryStore(getCollectionPath),
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
