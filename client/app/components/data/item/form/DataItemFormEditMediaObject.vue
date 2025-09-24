<script setup lang="ts" generic="M extends 'create' | 'update'">
import type { RegleErrorTree } from '@regle/core'
import type { FormDataFields, GetItemResponseMap } from '~~/types'

type Item = M extends 'create'
  ? FormDataFields<'/api/data/media_objects'>
  : GetItemResponseMap['/api/data/media_objects/{id}']

const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: M
  errors?: RegleErrorTree<Item>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="8">
      <v-row dense>
        <v-col cols="12">
          <data-autocomplete-hierarchical-vocabulary
            v-model="item.type"
            path="/api/vocabulary/media_object/types"
            label="type"
            :error-messages="errors?.type"
          />
        </v-col>
      </v-row>
      <v-row v-if="mode === 'update'" dense>
        <v-col cols="12">
          <v-text-field
            readonly
            :model-value="item.originalFilename"
            variant="solo-filled"
            flat
            label="filename"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-textarea v-model="item.description" label="description" />
        </v-col>
      </v-row>
    </v-col>
    <v-col v-if="mode === 'update'" cols="4">
      <data-media-object-image :item />
    </v-col>
  </v-row>
</template>
