<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type {
  GetItemResponseMap,
  PatchItemRequestMap,
  ResourceParent,
} from '~~/types'

type Item = PatchItemRequestMap['/api/data/analyses/potteries/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'pottery', '/api/data/potteries/{id}'>
}

defineProps<Props>()

const documentObject = ref<
  GetItemResponseMap['/api/data/media_objects/{id}'] | undefined
>()
const rawDataObject = ref<
  GetItemResponseMap['/api/data/media_objects/{id}'] | undefined
>()

watch(
  () => documentObject.value,
  (value) => {
    item.value.document = value?.['@id']
  },
)
watch(
  () => rawDataObject.value,
  (value) => {
    item.value.rawData = value?.['@id']
  },
)
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="item.pottery"
        path="/api/data/potteries"
        item-title="inventory"
        label="pottery"
        granted-only
        :error-messages="errors?.pottery"
        :disabled="parent?.key === 'pottery' || mode === 'update'"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-hierarchical-vocabulary
        v-model="item.type"
        path="/api/vocabulary/analysis/types"
        item-title="value"
        label="type"
        :error-messages="errors?.type"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6" class="px-2">
      <data-media-object-text-field
        v-model="documentObject"
        label="document"
        :error-messages="errors?.document"
        :readonly="false"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-media-object-text-field
        v-model="rawDataObject"
        label="raw data"
        :error-messages="errors?.rawData"
        :readonly="false"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-textarea
        v-model="item.summary"
        label="summary"
        :error-messages="errors?.summary"
      />
    </v-col>
  </v-row>
</template>
