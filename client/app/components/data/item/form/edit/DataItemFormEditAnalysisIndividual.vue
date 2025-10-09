<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type {
  PatchItemRequestMap,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

type Item = PatchItemRequestMap['/api/data/analyses/individuals/{id}'] &
  PostCollectionRequestMap['/api/data/analyses/individuals']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'individual'>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="item.subject"
        path="/api/data/individuals"
        item-title="identifier"
        label="subject"
        granted-only
        :error-messages="errors?.subject"
        :disabled="parent?.key === 'individual' || mode === 'update'"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="item.analysis"
        :error-messages="errors?.analysis"
        :disabled="mode === 'update'"
        :query-params="{
          'type.group': [
            AnalysisGroups.MaterialAnalysis,
            AnalysisGroups.Microscope,
            AnalysisGroups.AbsoluteDating,
          ],
          'type.value': ['ANTHRO'],
        }"
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
