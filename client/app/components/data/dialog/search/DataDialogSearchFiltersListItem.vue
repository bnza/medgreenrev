<script setup lang="ts">
import type { Filter } from '~~/types'

defineProps<{
  filter: Filter
}>()
defineEmits<{
  delete: []
  update: []
}>()
</script>

<template>
  <v-list-item>
    <template #default>
      <v-container class="h-90">
        <v-row align="center" justify="space-evenly" dense>
          <v-col cols="1" justify-end>
            <v-btn-group class="mb-6 mr-0 pr-0">
              <navigation-resource-item-update @update="$emit('update')" />
              <navigation-resource-item-delete @delete="$emit('delete')" />
            </v-btn-group>
          </v-col>
          <v-col cols="3">
            <v-text-field
              readonly
              :model-value="filter.property"
              variant="solo-filled"
              label="property"
              flat
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              readonly
              :model-value="filter.key"
              label="operands"
              variant="solo-filled"
              flat
            />
          </v-col>
          <v-col cols="5">
            <v-text-field
              readonly
              :model-value="filter.operands"
              :label="filter.operands.length > 1 ? 'values' : 'value'"
              variant="solo-filled"
              flat
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
  </v-list-item>
</template>
