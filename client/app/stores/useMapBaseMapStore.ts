import type { BaseMap } from '~~/types'

export const useMapBaseMapStore = <BM extends BaseMap>(baseMap: BM) =>
  defineStore(`map-base-map:${baseMap}`, () => {
    const visible = ref(true)
    const opacity = ref(1)

    return { visible, opacity }
  })()
