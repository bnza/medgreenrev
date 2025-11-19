<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { useScopedRegle } from '@regle/core'
import { required } from '@regle/rules'

type Path = '/api/vocabulary/botany/taxonomies/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  vernacularName: { required },
  class: { required },
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="8" xs="12" class="px-2">
        <v-text-field
          :model-value="fetchedItem?.value"
          label="value"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="r$.$value.vernacularName"
          label="vernacular name"
          :error-messages="r$.$errors?.vernacularName"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-selection-list
          v-model="r$.$value.class"
          path="/api/list/vocabulary/botany/taxonomy_classes"
          label="class"
          :error-messages="r$.$errors?.class"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-selection-list
          v-model="r$.$value.family"
          path="/api/list/vocabulary/botany/taxonomy_families"
          label="family"
          :error-messages="r$.$errors?.family"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
