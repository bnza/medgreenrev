import type { GetFeatureCollectionPath } from '~~/types'
import { makeTextLabelStyleFn, type NormalizedStyleFunction } from '~/utils/map'
import type { FeatureLike } from 'ol/Feature'
import { Style } from 'ol/style'

import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

export const useMapVectorApiStyleStore = <P extends GetFeatureCollectionPath>(
  path: P,
  groupKey: FeatureAggregationResourceKey,
) =>
  defineStore(`map-text-label:${path}`, () => {
    const styleFns = ref<Array<Ref<NormalizedStyleFunction>>>([])

    const rawStyleFns = computed(() =>
      styleFns.value.map((styleFn) => styleFn.value),
    )

    const { labelOptions, showNumberMatched } = storeToRefs(
      useMapVectorApiStore(path, groupKey),
    )

    const textLabelStyleFn = computed(() =>
      makeTextLabelStyleFn(labelOptions.value, showNumberMatched.value),
    )

    const overrideStyleFunction = computed(() => {
      // Capture reactive dependencies
      const fns = rawStyleFns.value
      const showCount = showNumberMatched.value
      const options = labelOptions.value

      return (
        feature: FeatureLike,
        baseStyle: Style,
        resolution: number,
      ): Style | Style[] => {
        const labelStyles = fns.flatMap((fn) => fn(feature, resolution))
        if (labelStyles.length === 0) return baseStyle

        // Optimization: if we have a baseStyle with an image, we should probably keep it.
        // OlStyle usually provides the Style created from OlStyleCircle etc as baseStyle.
        const baseClone = baseStyle.clone()
        const styles: Style[] = [baseClone]

        for (const s of labelStyles) {
          const text = s.getText()
          if (text) {
            styles.push(
              new Style({
                text: text.clone(),
                zIndex: s.getZIndex(),
              }),
            )
          }
        }

        return styles
      }
    })

    return {
      styleFns,
      textLabelStyleFn,
      overrideStyleFunction,
    }
  })()
