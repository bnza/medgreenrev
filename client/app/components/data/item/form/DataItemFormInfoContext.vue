<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

const props = defineProps<{
  item: GetItemResponseMap['/api/data/contexts/{id}']
}>()

const type = computed(
  () => `${props.item.type?.group}/${props.item.type?.value}`,
)
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.site?.name" label="site" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="type" label="type" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.name" label="name" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.description" label="description" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
