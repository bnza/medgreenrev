<script setup lang="ts">
import type { PatchItemRequestMap, ResourceParent } from '~~/types'
import type { RegleErrorTree } from '@regle/core'

type Item = PatchItemRequestMap['/api/data/zoo/teeth/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

defineProps<{
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

defineEmits<{
  submit: []
}>()
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete-stratigraphic-unit
          v-model="item.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="errors?.stratigraphicUnit"
          :disabled="parent?.key === 'stratigraphicUnit' || mode === 'update'"
          :granted-only="true"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete
          v-model="item.taxonomy"
          path="/api/vocabulary/zoo/taxonomies"
          item-title="value"
          label="species"
          :error-messages="errors?.taxonomy"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <data-autocomplete
          v-model="item.element"
          path="/api/vocabulary/zoo/bones"
          item-title="value"
          label="element"
          :query-params="{ teeth: true }"
          :error-messages="errors?.element"
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <data-selection-zoo-bone-side
          v-model="item.side"
          :multiple="false"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-checkbox
          v-model="item.connected"
          :label="item.connected ? 'jaw' : 'loose'"
          :error-messages="errors?.connected"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="item.notes"
          label="notes"
          rows="3"
          :error-messages="errors?.notes"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
