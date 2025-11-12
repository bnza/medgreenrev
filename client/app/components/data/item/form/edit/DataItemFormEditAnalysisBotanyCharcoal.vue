<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type {
  PatchItemRequestMap,
  PostCollectionRequestMap,
  ResourceParent,
  JsonLdItem,
} from '~~/types'

// Merge PATCH and POST shapes as in other edit forms
// Allows reuse in both create and update modes

type Item = PatchItemRequestMap['/api/data/analyses/botany/charcoals/{id}'] &
  PostCollectionRequestMap['/api/data/analyses/botany/charcoals']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'botanyCharcoal'> | ResourceParent<'analysis'>
}

defineProps<Props>()

const analysis = ref<(JsonLdItem & { type?: { group: string } }) | undefined>()

const showAbsDatingForm = ref(false)

watch(showAbsDatingForm, (flag) => {
  if (flag) {
    if (!item.value.absDatingAnalysis) {
      item.value.absDatingAnalysis = {}
    }
  }
})
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="item.subject"
        path="/api/data/botany/charcoals"
        item-title="code"
        label="subject"
        granted-only
        :error-messages="errors?.subject"
        :disabled="parent?.key === 'botanyCharcoal' || mode === 'update'"
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
        @selected="analysis = $event"
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
  <v-row justify="end">
    <v-col cols="4">
      <v-checkbox
        v-if="analysis?.type?.group === 'absolute dating'"
        v-model="showAbsDatingForm"
        data-testid="show-abs-dating-form"
        label="edit absolute dating data"
      />
    </v-col>
  </v-row>
  <data-item-form-edit-abs-dating-analysis
    v-if="
      (showAbsDatingForm && analysis?.type?.group === 'absolute dating') ||
      item.absDatingAnalysis
    "
    v-model:item="item.absDatingAnalysis"
    :mode
    :errors
    :parent="
      item.analysis
        ? { key: 'analysisBotanyCharcoal', item: { '@id': item.analysis } }
        : undefined
    "
  />
</template>
