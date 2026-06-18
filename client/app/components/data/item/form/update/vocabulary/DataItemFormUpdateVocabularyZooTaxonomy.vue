<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { required } from '@regle/rules'

type Path = '/api/vocabulary/zoo/taxonomies/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  englishName: { required },
  spanishName: { required },
  class: { required },
})

const englishNameModel = useLowercaseModel(toRef(r$.$value, 'englishName'))
const spanishNameModel = useLowercaseModel(toRef(r$.$value, 'spanishName'))
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="fetchedItem?.code" label="code" disabled />
      </v-col>
      <v-col cols="8" xs="12" class="px-2">
        <v-text-field
          :model-value="fetchedItem?.value"
          label="value"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="englishNameModel"
          label="english name"
          :error-messages="r$.$errors?.englishName"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="spanishNameModel"
          label="spanish name"
          :error-messages="r$.$errors?.spanishName"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <data-selection-list
          v-model="r$.$value.class"
          path="/api/list/vocabulary/zoo/taxonomy_classes"
          label="class"
          :error-messages="r$.$errors?.class"
        />
      </v-col>
      <v-col cols="12" md="6">
        <data-selection-list
          v-model="r$.$value.family"
          path="/api/list/vocabulary/zoo/taxonomy_families"
          label="family"
          :error-messages="r$.$errors?.family"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
