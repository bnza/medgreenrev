<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { Iri, PatchItemRequestMap, ResourceParent } from '~~/types'

import {
  mediaObjectJoinInjectionKey,
  useMediaObjectJoin,
} from '~/composables/injection/useMediaObjectJoin'

type Item = PatchItemRequestMap['/api/data/analyses/potteries/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'pottery', '/api/data/potteries/{id}'>
}

defineProps<Props>()

const itemIri = computed(() => item.value.pottery as Iri)

const mediaObjectJoin = useMediaObjectJoin(itemIri)

provide(mediaObjectJoinInjectionKey, mediaObjectJoin)
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
      <v-textarea
        v-model="item.summary"
        label="summary"
        :error-messages="errors?.summary"
      />
    </v-col>
  </v-row>
</template>
