<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type {
  PatchItemRequestMap,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

// Merge PATCH and POST shapes as in other edit forms
// Allows reuse in both create and update modes

type Item = PatchItemRequestMap['/api/data/analyses/botany/seeds/{id}'] &
  PostCollectionRequestMap['/api/data/analyses/botany/seeds']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'botanySeed'> | ResourceParent<'analysis'>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="item.subject"
        path="/api/data/botany/seeds"
        item-title="code"
        label="subject"
        granted-only
        :error-messages="errors?.subject"
        :disabled="parent?.key === 'botanySeed' || mode === 'update'"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="item.analysis"
        :error-messages="errors?.analysis"
        :disabled="parent?.key === 'analysis' || mode === 'update'"
        :query-params="{
          'type.group': [
            AnalysisGroups.MaterialAnalysis,
            AnalysisGroups.Microscope,
            AnalysisGroups.AbsoluteDating,
          ],
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
