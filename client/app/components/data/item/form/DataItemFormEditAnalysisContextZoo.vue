<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type {
  PatchItemRequestMap,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { AnalysisGroups } from '~/utils'

type Item = PatchItemRequestMap['/api/data/analyses/contexts/zoo/{id}'] &
  PostCollectionRequestMap['/api/data/analyses/contexts/zoo']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?:
    | ResourceParent<'context', '/api/data/contexts/{id}'>
    | ResourceParent<'analysis', '/api/data/analyses/{id}'>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="item.subject"
        path="/api/data/contexts"
        item-title="name"
        label="subject"
        granted-only
        :error-messages="errors?.subject"
        :disabled="parent?.key === 'context' || mode === 'update'"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="item.analysis"
        :error-messages="errors?.analysis"
        :disabled="parent?.key === 'analysis' || mode === 'update'"
        :query-params="{ 'type.group': [AnalysisGroups.Zooarchaeology] }"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <data-selection-vocabulary
        v-model="item.taxonomies"
        multiple
        path="/api/vocabulary/zoo/taxonomies"
        label="taxonomies"
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
