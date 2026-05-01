<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { required } from '@regle/rules'

type Path = '/api/vocabulary/botany/taxonomies/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="3" xs="12" class="px-2">
        <v-text-field
          :model-value="fetchedItem?.flat?.class"
          label="class"
          disabled
        />
      </v-col>
      <v-col cols="3" xs="12" class="px-2">
        <v-text-field
          :model-value="fetchedItem?.flat?.family"
          label="family"
          disabled
        />
      </v-col>
      <v-col cols="3" xs="12" class="px-2">
        <v-text-field
          :model-value="fetchedItem?.flat?.genus"
          label="genus"
          disabled
        />
      </v-col>
      <v-col cols="3" xs="12" class="px-2">
        <v-text-field
          :model-value="fetchedItem?.flat?.species"
          label="species"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" xs="12" class="px-2">
        <v-text-field
          :model-value="fetchedItem?.flat?.value"
          label="value"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="r$.$value.englishName" label="english name" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="r$.$value.spanishName" label="spanish name" />
      </v-col>
    </v-row>
  </v-container>
</template>
