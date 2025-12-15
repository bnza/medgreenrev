import type { GetFeatureCollectionPath } from '~~/types'

export const useMapVectorApiStore = <P extends GetFeatureCollectionPath>(
  baseMap: P,
) =>
  defineStore(`map-vector-api:${baseMap}`, () => {
    const visible = ref(true)
    const opacity = ref(100)

    return { visible, opacity }
  })()
