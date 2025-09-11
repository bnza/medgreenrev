<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { Iri, PatchItemRequestMap, ResourceParent } from '~~/types'

import {
  mediaObjectJoinInjectionKey,
  useMediaObjectJoin,
} from '~/composables/injection/useMediaObjectJoin'

type Item = PatchItemRequestMap['/api/data/analyses/contexts/zoo/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'context', '/api/data/contexts/{id}'>
}

defineProps<Props>()

const itemIri = computed(() => item.value.item as Iri)

const mediaObjectJoin = useMediaObjectJoin(itemIri)

provide(mediaObjectJoinInjectionKey, mediaObjectJoin)
</script>

<template>
  <v-row>
    <v-col cols="6">
      <data-autocomplete
        v-model="item.item"
        path="/api/data/contexts"
        item-title="name"
        label="context"
        granted-only
        :error-messages="errors?.item"
        :disabled="parent?.key === 'context' || mode === 'update'"
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
        v-model="item.document"
        label="document"
        :error-messages="errors?.document"
        :readonly="false"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-media-object-text-field
        v-model="item.rawData"
        label="raw data"
        :error-messages="errors?.rawData"
        :readonly="false"
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
