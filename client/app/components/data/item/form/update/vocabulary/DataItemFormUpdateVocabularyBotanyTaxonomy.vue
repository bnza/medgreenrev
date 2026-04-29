<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'

type Path = '/api/vocabulary/botany/taxonomies/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="fetchedItem?.parent?.value ?? '—'"
          label="parent"
          disabled
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="fetchedItem?.value"
          label="value"
          disabled
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="fetchedItem?.level"
          label="level"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="model.englishName" label="vernacular name" />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="model.spanishName" label="spanish name" />
      </v-col>
    </v-row>
  </v-container>
</template>
