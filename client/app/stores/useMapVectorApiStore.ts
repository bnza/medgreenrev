import type { GetFeatureCollectionPath } from '~~/types'
import { makeTextLabelStyleFn, type TextLabelOptions } from '~/utils/map'

export const useMapVectorApiStore = <P extends GetFeatureCollectionPath>(
  baseMap: P,
) =>
  defineStore(`map-vector-api:${baseMap}`, () => {
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
        labelOptions.value.visible = value
      },
    })

    const textLabelStyleFn = computed(() =>
      makeTextLabelStyleFn(labelOptions.value),
    )

    return { visible, opacity, labelOptions, labelVisible, textLabelStyleFn }
  })()
