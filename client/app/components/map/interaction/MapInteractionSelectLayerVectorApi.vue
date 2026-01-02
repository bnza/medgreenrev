<script setup lang="ts">
import { Interactions, Styles } from 'vue3-openlayers'
import { click as clickSelectCondition } from 'ol/events/condition'
import type { SelectEvent } from 'ol/interaction/Select'
import type { GetFeatureCollectionPath } from '~~/types'
import type Feature from 'ol/Feature.js'
import type { Geometry } from 'ol/geom'

const { fill, stroke, offsetX, offsetY, textBaseline, textAlign, overflow } =
  DEFAULT_TEXT_LABEL_OPTIONS

const props = defineProps<{
  path: GetFeatureCollectionPath
  idPrefix: string
}>()

const interactionSelectRef = useTemplateRef<
  typeof Interactions.OlInteractionSelect
>('interactionSelectRef')

const text = ref<string>('')

const { labelOptions } = useMapVectorApiStore(props.path)

const emit = defineEmits<{
  featureSelected: [Feature<Geometry> | null]
}>()

const onSelect = (event: SelectEvent) => {
  const selected = event.selected[0] ?? null
  text.value = selected?.get(labelOptions.labelProperty) ?? ''
  emit('featureSelected', selected)
}

const filterRegex = new RegExp(`^${props.idPrefix}.`)
const filter = (feature: Feature<Geometry>) => {
  const id = feature.getId()
  return typeof id === 'string' && filterRegex.test(id)
}
</script>

<template>
  <Interactions.OlInteractionSelect
    ref="interactionSelectRef"
    :condition="clickSelectCondition"
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
