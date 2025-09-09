<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PatchItemRequestMap, PostCollectionRequestMap } from '~~/types'

type Item = PostCollectionRequestMap['/api/data/media_objects'] &
  PatchItemRequestMap['/api/data/media_objects/{id}']
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Item>
}

defineProps<Props>()
</script>

<template>
  <v-row dense>
    <v-col cols="12" sm="6">
      <data-autocomplete-hierarchical-vocabulary
        v-model="item.type"
        path="/api/vocabulary/media_object/types"
        label="type"
        :error-messages="errors?.type"
      />
    </v-col>
  </v-row>
  <v-row dense>
    <v-col cols="12" sm="6">
      <v-textarea v-model="item.description" label="description" />
    </v-col>
  </v-row>
</template>
