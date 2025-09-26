<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { GetItemResponseMap } from '~~/types'

type Item = GetItemResponseMap['/api/data/media_objects/{id}']

const item = defineModel<Item>('item', { required: true })

interface Props {
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
      <v-row dense>
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
    <v-col cols="4">
      <data-media-object-image :item />
    </v-col>
  </v-row>
</template>
