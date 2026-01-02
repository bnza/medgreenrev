import type {
  GetFeatureCollectionExtentPath,
  GetFeatureCollectionPath,
} from '~~/types'
import useAppQueryCache from './useAppQueryCache'
import useCollectionQueryStore from '~/stores/useCollectionQueryStore'
import { GetFeatureCollectionExtentOperation } from '~/api/operations/GetFeatureCollectionExtentOperation'
import type { ProjectionLike } from 'ol/proj'
import { useMapVectorApiStore } from '~/stores/useMapVectorApiStore'

const FEATURE_COLLECTION_PATH_MAP = {
  '/api/features/history/locations':
    '/api/features/extent_matched/history/locations',
  '/api/features/sites': '/api/features/extent_matched/sites',
} as const satisfies Record<
  GetFeatureCollectionPath,
  GetFeatureCollectionExtentPath
>

export function useGetFeatureCollectionExtentQuery(
  path: GetFeatureCollectionPath,
  enabled: Ref<boolean>,
  projection: ProjectionLike,
) {
  const getFeatureCollectionOperation = new GetFeatureCollectionExtentOperation(
    FEATURE_COLLECTION_PATH_MAP[path],
  )
  const mapVectorApiStore = useMapVectorApiStore(path)

  if (!mapVectorApiStore.resourceConfig) {
    throw new Error(`Resource key not found for path ${path}`)
  }

  const { RESOURCE_QUERY_KEY } = useAppQueryCache(
    mapVectorApiStore.resourcePath,
    path,
  )

  // The composable uses the resourceConfig to sync the fetch with the actual filtered endpoint
  const { filterQueryObject } = storeToRefs(
    useCollectionQueryStore(mapVectorApiStore.resourceConfig.apiPath),
  )

  const featureQuery = defineQueryOptions(({ queryObject, enabled }) => ({
    key: RESOURCE_QUERY_KEY.byFilter({
      ...queryObject,
      crs: projection,
    }),
    enabled,
    query: () =>
      getFeatureCollectionOperation.request({
        query: { ...queryObject, crs: projection },
      }),
  }))

  return useQuery(featureQuery, () => ({
    queryObject: filterQueryObject.value,
    enabled: enabled.value,
  }))
}

export default useGetFeatureCollectionExtentQuery
