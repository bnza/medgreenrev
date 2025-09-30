<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PatchItemRequestMap } from '~~/types'

type Item = PatchItemRequestMap['/api/data/analyses/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
}

defineProps<Props>()
defineEmits<{
  'update:item': [value: any]
}>()
</script>

<template>
  <v-card-text class="px-0">
    <v-row>
      <v-col cols="4" class="px-2">
        <data-autocomplete-hierarchical-vocabulary
          v-model="item.type"
          path="/api/vocabulary/analysis/types"
          label="type"
          :error-messages="errors?.type"
          :disabled="mode === 'update'"
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field
          v-model="item.year"
          label="year"
          :error-messages="errors?.year"
        />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field
          v-model="item.identifier"
          label="identifier"
          :error-messages="errors?.identifier"
          :disabled="mode === 'update'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" class="px-2">
        <data-selection-analysis-status v-model="item.status" />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field v-model="item.laboratory" label="laboratory" />
      </v-col>
      <v-col cols="4">
        <v-text-field v-model="item.responsible" label="responsible" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="px-2">
        <v-textarea
          v-model="item.summary"
          label="summary"
          :error-messages="errors?.summary"
          rows="3"
        />
      </v-col>
    </v-row>
  </v-card-text>
</template>
