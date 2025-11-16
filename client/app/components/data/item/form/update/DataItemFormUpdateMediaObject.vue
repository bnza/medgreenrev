<script setup lang="ts">
import { useScopedRegle } from '@regle/core'
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { required } from '@regle/rules'

type Path = '/api/data/media_objects/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  type: { required },
})
</script>

<template>
  <v-row>
    <v-col cols="8">
      <v-row dense>
        <v-col cols="12">
          <data-autocomplete-hierarchical-vocabulary
            v-model="r$.$value.type"
            path="/api/vocabulary/media_object/types"
            label="type"
            :error-messages="r$.$errors?.type"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            readonly
            :model-value="fetchedItem?.originalFilename"
            variant="solo-filled"
            flat
            label="filename"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-textarea v-model="r$.$value.description" label="description" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4">
      <data-media-object-image v-if="fetchedItem" :item="fetchedItem" />
    </v-col>
  </v-row>
</template>
