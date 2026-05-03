<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { required } from '@regle/rules'
type Path = '/api/data/analyses/sediment_core_depth_botany_taxonomies/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()
const model = ref(structuredClone(props.initialValue))
const { r$ } = useScopedRegle(model, {
  taxonomy: { required },
})
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
      <data-autocomplete
        :model-value="fetchedItem?.analysis?.subject"
        path="/api/data/sediment_core_depths"
        item-title="code"
        label="sediment core depth"
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
