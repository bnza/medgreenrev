<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type {
  PatchItemRequestMap,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

type Item = Partial<
  PostCollectionRequestMap['/api/data/history/plants'] &
    PatchItemRequestMap['/api/data/history/plants/{id}']
>
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Item>
  parent?: ResourceParent<'historyLocation'>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="4" xs="12" class="px-2">
      <data-autocomplete
        v-model="item.location"
        path="/api/data/history/locations"
        item-title="name"
        label="location"
        :error-messages="errors?.location"
        :disabled="parent?.key === 'historyLocation' || mode === 'update'"
      />
    </v-col>
    <v-col cols="8" xs="12" class="px-2">
      <data-autocomplete
        v-model="item.plant"
        path="/api/vocabulary/history/plants"
        item-title="value"
        label="plant"
        :error-messages="errors?.plant"
        :disabled="mode === 'update'"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6" xs="12" class="px-2">
      <v-text-field
        v-model="item.chronologyLower"
        label="chronology (lower)"
        :error-messages="errors?.chronologyLower"
      />
    </v-col>
    <v-col cols="6" xs="12" class="px-2">
      <v-text-field
        v-model="item.chronologyUpper"
        label="chronology (upper)"
        :error-messages="errors?.chronologyUpper"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <data-selection-list
        v-model="item.reference"
        path="/api/list/history/references"
        label="reference"
        :error-messages="errors?.reference"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="item.notes" label="notes" />
    </v-col>
  </v-row>
</template>
