import type { GetFeatureCollectionPath } from '~~/types'
import type VectorLayer from 'ol/layer/Vector'
import {
  decorateStyle,
  makeTextLabelStyleFn,
  normalizeBaseStyle,
  type NormalizedStyleFunction,
} from '~/utils/map'

export const useMapVectorApiStyleStore = <P extends GetFeatureCollectionPath>(
  path: P,
  vectorLayer: ComputedRef<VectorLayer<any> | null>,
) =>
  defineStore(`map-text-label:${path}`, () => {
    const baseStyleFn = ref<NormalizedStyleFunction | null>(null)

    const styleFns = ref<Array<Ref<NormalizedStyleFunction>>>([])

    const rawStyleFns = computed(() =>
      styleFns.value.map((styleFn) => styleFn.value),
    )

    const decoratedStyleFn = computed(() => {
      if (!vectorLayer.value) {
        return null
      }

      // Pass the base style as a readonly value and set the decorated style function on the layer
      return baseStyleFn.value
        ? decorateStyle(baseStyleFn.value, rawStyleFns.value)
        : null
    })

    const { labelOptions } = storeToRefs(useMapVectorApiStore(path))

    const textLabelStyleFn = computed(() =>
      makeTextLabelStyleFn(labelOptions.value),
    )

    const setStyle = () => {
      vectorLayer.value?.setStyle(decoratedStyleFn.value)
    }

    watch(
      () => vectorLayer.value,
      (newValue, oldValue) => {
        if (!oldValue) {
          const rawBase = vectorLayer.value?.getStyle() ?? null
          baseStyleFn.value = baseStyleFn.value ?? normalizeBaseStyle(rawBase)
        }
      },
    )

    watch(() => decoratedStyleFn.value, setStyle, {
      immediate: true,
      deep: true,
    })

    return {
      baseStyleFn,
      setStyle,
      styleFns,
      textLabelStyleFn,
    }
  })()
