<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'

type Path = '/api/vocabulary/botany/taxonomies/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {})

const englishNameModel = useLowercaseModel(toRef(r$.$value, 'englishName'))
const spanishNameModel = useLowercaseModel(toRef(r$.$value, 'spanishName'))
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
        <v-text-field v-model="englishNameModel" label="english name" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="spanishNameModel" label="spanish name" />
      </v-col>
    </v-row>
  </v-container>
</template>
