<script setup lang="ts">
import { useMediaObject } from '~/composables/useMediaObject'
import type { GetItemResponseMap } from '~~/types'

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
</script>

<template>
  <v-img
    :lazy-src="mediaThumbnailUrl"
    :src="mediaThumbnailUrl"
    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.3)"
    :height="size"
    :width="size"
    class="bg-grey-lighten-2 align-end"
    :cover="size >= 200"
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
