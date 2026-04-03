<script setup lang="ts">
import { Interactions, Styles } from 'vue3-openlayers'
import { click as clickCondition } from 'ol/events/condition'
import type { SelectEvent } from 'ol/interaction/Select'
import type { GetFeatureCollectionPath } from '~~/types'
import type Feature from 'ol/Feature.js'
import type { Geometry } from 'ol/geom'
import type { FeatureAggregationResourceKey } from '~/stores/useMapLayerExclusiveVisibilityStore'

const { fill, stroke, offsetX, offsetY, textBaseline, textAlign, overflow } =
  DEFAULT_TEXT_LABEL_OPTIONS

const props = defineProps<{
  path: GetFeatureCollectionPath
  groupKey: FeatureAggregationResourceKey
  idPrefix: string
}>()

const interactionSelectRef = useTemplateRef<
  typeof Interactions.OlInteractionSelect
>('interactionSelectRef')

const text = ref<string>('')

const { labelOptions } = useMapVectorApiStore(props.path, props.groupKey)

const emit = defineEmits<{
  featureSelected: [Feature<Geometry> | null]
}>()

const onSelect = (event: SelectEvent) => {
  const selected = event.selected[0] ?? null
  text.value = selected?.get(labelOptions.labelProperty) ?? ''
  emit('featureSelected', selected)
}

const clearSelection = () => {
  onSelect({ selected: [], deselected: [], type: 'select' } as any)
  interactionSelectRef.value?.select.getFeatures().clear()
}

defineExpose({ clearSelection })

const filterRegex = new RegExp(`^${props.idPrefix}.`)
const filter = (feature: Feature<Geometry>) => {
  const id = feature.getId()
  return typeof id === 'string' && filterRegex.test(id)
}

const hitTolerance =
  typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0 ? 10 : 0
</script>

<template>
  <Interactions.OlInteractionSelect
    ref="interactionSelectRef"
    :condition="clickCondition"
    :hit-tolerance
    :filter
    @select="onSelect"
  >
    <Styles.OlStyle :z-index="Infinity">
      <Styles.OlStyleCircle :radius="4">
        <Styles.OlStyleFill color="yellow" />
        <Styles.OlStyleStroke color="white" :width="1" />
      </Styles.OlStyleCircle>
      <Styles.OlStyleText
        v-if="labelOptions.visible"
        :text
        :font="`14px Montserrat, Manrope, sans-serif`"
        :offset-x
        :offset-y
        :text-baseline
        :text-align
        :overflow
        declutter-mode="obstacle"
      >
        <Styles.OlStyleFill :color="fill.color" />
        <Styles.OlStyleStroke color="yellow" :width="stroke.width" />
      </Styles.OlStyleText>
    </Styles.OlStyle>
  </Interactions.OlInteractionSelect>
</template>
