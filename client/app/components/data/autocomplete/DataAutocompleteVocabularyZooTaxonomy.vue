<script setup lang="ts">
import type { JsonLdItem } from '~~/types'
const model = defineModel<string | null>()
withDefaults(
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
    path="/api/vocabulary/zoo/taxonomies"
    item-title="value"
    :query-params
    @selected="emit('selected', $event)"
  >
    <template #item="{ item, props: slotProps }">
      <v-list-item v-if="item.value" v-bind="slotProps" :title="undefined">
        <span v-if="item.englishName" class="text-grey-darken-1">{{item.englishName}}</span>
        <br v-if="item.englishName" />
        {{ item.value }}
      </v-list-item>
    </template>
    <template #selection="{ item }">
      <v-list-item v-if="item.value">
        <span v-if="item.englishName" class="text-grey-darken-1">{{item.englishName}}</span>
        <span v-if="item.englishName" class="text-grey-darken-1"> - </span>
        {{ item.value }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
