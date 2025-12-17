import type { GetFeatureCollectionPath } from '~~/types'
import type { TextLabelOptions } from '~/utils/map'

export const useMapVectorApiStore = <P extends GetFeatureCollectionPath>(
  path: P,
) =>
  defineStore(`map-vector-api:${path}`, () => {
    const visible = ref(true)
    const opacity = ref(100)
    const labelOptions: Ref<TextLabelOptions> = ref({
      labelProperty: 'value',
      visible: false,
    })

    const labelVisible = computed<boolean>({
      get: () => {
        return labelOptions.value.visible
      },
      set: (value: boolean) => {
        labelOptions.value = { ...labelOptions.value, visible: value }
      },
    })

    return { visible, opacity, labelOptions, labelVisible }
  })()
