<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'

type Path = '/api/data/analyses/context_botany_taxonomies/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {})
</script>

<template>
  <v-row>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        :model-value="fetchedItem?.analysis?.analysis"
        disabled
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-context
        :model-value="fetchedItem?.analysis?.subject"
        disabled
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="1" class="px-2">
      <v-checkbox v-model="r$.$value.type" label="type" />
    </v-col>
    <v-col cols="1" class="px-2">
      <v-checkbox v-model="r$.$value.cf" label="cf" />
    </v-col>
    <v-col cols="6">
      <data-autocomplete-vocabulary-botany-taxonomy
        v-model="r$.$value.taxonomy"
        :error-messages="r$.$errors?.taxonomy"
      />
    </v-col>
    <v-col cols="1" class="px-2">
      <v-checkbox v-model="r$.$value.sp" label="sp" />
    </v-col>
  </v-row>
</template>
