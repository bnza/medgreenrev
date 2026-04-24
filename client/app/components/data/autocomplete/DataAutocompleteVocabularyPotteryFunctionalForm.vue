<script setup lang="ts">
import type { JsonLdItem } from '~~/types'

const model = defineModel<string>()

const emit = defineEmits<{
  selected: [item: JsonLdItem | undefined]
}>()
</script>

<template>
  <data-autocomplete
    v-model="model"
    label="functional form"
    path="/api/vocabulary/pottery/functional_forms"
    item-title="value"
    @selected="emit('selected', $event)"
  >
    <template #item="{ item, props: slotProps }">
      <v-list-item
        v-if="item.functionalGroup"
        v-bind="slotProps"
        :title="undefined"
      >
        <span class="text-grey-darken-1">{{ item.functionalGroup.value }}</span>
        - {{ item.value }}
      </v-list-item>
    </template>
    <template #selection="{ item }">
      <v-list-item v-if="item.functionalGroup">
        <span class="text-grey-darken-1">{{ item.functionalGroup.value }}</span>
        - {{ item.value }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
