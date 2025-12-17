<script setup lang="ts">
import { Interactions, Styles } from 'vue3-openlayers'
import { click as clickSelectCondition } from 'ol/events/condition'
import type { SelectEvent } from 'ol/interaction/Select'
import type { GetFeatureCollectionPath } from '~~/types'

const { fill, stroke, offsetX, offsetY, textBaseline, textAlign, overflow } =
  DEFAULT_TEXT_LABEL_OPTIONS

const props = defineProps<{
  path: GetFeatureCollectionPath
}>()

const interactionSelectRef = useTemplateRef<
  typeof Interactions.OlInteractionSelect
>('interactionSelectRef')

const text = ref<string>('Pippo')

const { labelOptions } = storeToRefs(useMapVectorApiStore(props.path))

const onSelect = (event: SelectEvent) => {
  const selected = event.selected[0]
  text.value = selected?.get(labelOptions.value.labelProperty) ?? ''
}
</script>

<template>
  <Interactions.OlInteractionSelect
    ref="interactionSelectRef"
    :condition="clickSelectCondition"
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
