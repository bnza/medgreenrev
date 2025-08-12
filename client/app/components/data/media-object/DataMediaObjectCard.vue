<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'
import { useMediaObject } from '~/composables/useMediaObject'
const deletingItem = defineModel<string | undefined>({ required: true })
const props = defineProps<{
  item: {
    '@id': string
    mediaObject: GetItemResponseMap['/api/data/media_objects/{id}']
  }
  canUpdate?: boolean
}>()
const { mediaThumbnailUrl, fileName, icon, iconColor, mediaUrl } =
  useMediaObject(props.item.mediaObject)

defineEmits<{
  click: [id: string]
}>()
</script>

<template>
  <v-card
    data-testid="media-object-join-card"
    class="mx-auto my-4"
    width="200"
    variant="outlined"
    color="surface-variant"
  >
    <template #title>
      <p class="text-body-2 text-white pa-1">{{ fileName }}</p>
    </template>
    <v-img
      :lazy-src="mediaThumbnailUrl"
      :src="mediaThumbnailUrl"
      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.3)"
      height="200"
      width="200"
      class="bg-grey-lighten-2 align-end"
      cover
      @click="$emit('click', item['@id'])"
    >
      <template #placeholder>
        <v-row align-content="center" class="fill-height" justify="center">
          <v-progress-circular
            v-if="mediaThumbnailUrl"
            color="warning"
            indeterminate
          />
          <v-icon v-else :icon size="90" :color="iconColor" />
        </v-row>
      </template>
    </v-img>
    <template #actions>
      <v-btn
        v-if="canUpdate"
        class="mr-4"
        density="compact"
        :icon="true"
        variant="text"
        data-testid="delete-media-button"
        color="error"
        @click="deletingItem = item['@id']"
      >
        <v-icon icon="fa fa-minus" />
        <v-tooltip activator="parent" location="bottom">Delete media</v-tooltip>
      </v-btn>
      <v-spacer />
      <v-btn
        class="mr-4"
        density="compact"
        :icon="true"
        data-testid="download-media-button"
        :href="mediaUrl"
        target="_blank"
        download
      >
        <v-icon icon="fas fa-download" />
        <v-tooltip activator="parent" location="bottom">download</v-tooltip>
      </v-btn>
    </template>
  </v-card>
</template>
