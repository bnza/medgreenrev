<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type {
  PatchItemRequestMap,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

type Item = PatchItemRequestMap['/api/data/analyses/sites/anthropology/{id}'] &
  PostCollectionRequestMap['/api/data/analyses/sites/anthropology']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?:
    | ResourceParent<'site', '/api/data/sites/{id}'>
    | ResourceParent<'analysis', '/api/data/analyses/{id}'>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete-site
        v-model="item.subject"
        path="/api/data/sites"
        item-title="code"
        label="subject"
        granted-only
        :error-messages="errors?.subject"
        :disabled="parent?.key === 'site' || mode === 'update'"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete-analysis
        v-model="item.analysis"
        :error-messages="errors?.analysis"
        :disabled="parent?.key === 'analysis' || mode === 'update'"
        :query-params="{
          'type.code': ['ANTHRO'],
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
