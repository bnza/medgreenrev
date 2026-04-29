<script setup lang="ts">
import type { JsonLdItem } from '~~/types'

const model = defineModel<string | null>()

const props = withDefaults(
  defineProps<{
    queryParams?: Record<string, any>
    label?: string
  }>(),
  {
    queryParams: () => ({}),
    label: 'taxonomy',
  },
)

const emit = defineEmits<{
  selected: [item: JsonLdItem | undefined]
}>()
</script>

<template>
  <data-autocomplete
    v-model="model"
    :label
    path="/api/vocabulary/botany/taxonomies"
    item-title="value"
    :query-params
    @selected="emit('selected', $event)"
  >
    <template #item="{ item, props: slotProps }">
      <v-list-item v-if="item.level" v-bind="slotProps" :title="undefined">
        <span class="text-grey-darken-1">{{ item.level }}</span>
        - {{ item.flat.value }}
      </v-list-item>
    </template>
    <template #selection="{ item }">
      <v-list-item v-if="item.level">
        <span class="text-grey-darken-1">{{ item.level }}</span>
        - {{ item.flat.value }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
