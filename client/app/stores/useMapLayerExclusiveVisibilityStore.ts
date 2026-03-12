import type { ApiResourceKey, GetFeatureCollectionPath } from '~~/types'

export type FeatureAggregationResourceKey = Extract<
  ApiResourceKey,
  'archaeologicalSite' | 'vocHistoryLocation' | 'samplingSite'
>

export const GROUP_KEY_FEATURE_PATH_MAP: Record<
  FeatureAggregationResourceKey,
  GetFeatureCollectionPath
> = {
  archaeologicalSite: '/api/features/archaeological_sites',
  vocHistoryLocation: '/api/features/history/locations',
  samplingSite: '/api/features/sampling_sites',
} as const

export const useMapLayerExclusiveVisibilityStore = defineStore(
  'map-layer-exclusive-visibility',
  () => {
    const activeLayers = ref(
      new Map<FeatureAggregationResourceKey, GetFeatureCollectionPath | null>([
        ['archaeologicalSite', '/api/features/archaeological_sites'],
        ['vocHistoryLocation', '/api/features/history/locations'],
        ['samplingSite', '/api/features/sampling_sites'],
      ]),
    )

    const setActive = (
      groupKey: FeatureAggregationResourceKey,
      layerPath: GetFeatureCollectionPath,
    ) => {
      const current = activeLayers.value.get(groupKey)
      if (current === layerPath) {
        activeLayers.value.set(groupKey, null)
      } else {
        activeLayers.value.set(groupKey, layerPath)
      }
    }

    const isActive = (
      groupKey: FeatureAggregationResourceKey,
      layerPath: GetFeatureCollectionPath,
    ) => {
      return activeLayers.value.get(groupKey) === layerPath
    }

    return {
      activeLayers,
      setActive,
      isActive,
    }
  },
)
