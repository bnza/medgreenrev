<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

const props = withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/analyses/{id}']
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)

const type = computed(
  () => `${props.item.type?.group}/${props.item.type?.value}`,
)

const statusText = computed(() => {
  switch (props.item.status) {
    case 0:
      return 'requested'
    case 1:
      return 'pending'
    case 2:
      return 'completed'
    default:
      return 'unknown'
  }
})
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="type" label="type" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.year" label="year" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.identifier" label="identifier" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="statusText" label="status" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.laboratory" label="laboratory" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.responsible" label="responsible" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.summary" label="summary" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
