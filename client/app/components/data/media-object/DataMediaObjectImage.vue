<script setup lang="ts">
import { useMediaObject } from '~/composables/useMediaObject'
import type { GetItemResponseMap, Iri } from '~~/types'

const props = withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/media_objects/{id}']
    size?: number
  }>(),
  {
    size: 200,
  },
)

const iconSize = props.size / 3

const { mediaThumbnailUrl, icon, iconColor } = useMediaObject(props.item)

// Retry logic: append a cache-busting query param to force reload
const retrySrc = ref(mediaThumbnailUrl)
const maxRetries = 5
let retryCount = 0

function onImageError() {
  if (mediaThumbnailUrl && retryCount < maxRetries) {
    retryCount++
    setTimeout(() => {
      // Append or update a cache-busting param to force v-img to re-fetch
      const separator = mediaThumbnailUrl.includes('?') ? '&' : '?'
      retrySrc.value = `${mediaThumbnailUrl}${separator}_retry=${retryCount}`
    }, 1000 * retryCount) // exponential-ish backoff: 1s, 2s, 3s, 4s, 5s
  }
}

defineEmits<{
  click: [iri: Iri]
}>()
</script>

<template>
  <v-img
    :src="retrySrc"
    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.3)"
    :height="size"
    :width="size"
    class="bg-grey-lighten-2 align-end"
    :cover="size >= 200"
    @error="onImageError"
    @click="$emit('click', item['@id'])"
  >
    <template #placeholder>
      <v-row align-content="center" class="fill-height" justify="center">
        <v-progress-circular
          v-if="mediaThumbnailUrl"
          color="warning"
          indeterminate
        />
        <v-icon v-else :icon :size="iconSize" :color="iconColor" />
      </v-row>
    </template>
  </v-img>
</template>
