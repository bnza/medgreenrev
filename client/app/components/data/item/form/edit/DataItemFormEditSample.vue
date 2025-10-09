<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PatchItemRequestMap, ResourceParent } from '~~/types'

type Item = PatchItemRequestMap['/api/data/samples/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'site'>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="4">
      <data-autocomplete-site
        v-model="item.site"
        path="/api/data/sites"
        item-title="name"
        label="site"
        granted-only
        :error-messages="errors?.site"
        :disabled="parent?.key === 'site' || mode === 'update'"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4" class="px-2">
      <data-autocomplete
        v-model="item.type"
        path="/api/vocabulary/sample/types"
        item-title="value"
        label="type"
        :error-messages="errors?.type"
        :disabled="mode === 'update'"
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field
        v-model="item.year"
        label="year"
        :error-messages="errors?.year"
        :disabled="mode === 'update'"
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field
        v-model="item.number"
        label="number"
        :error-messages="errors?.number"
        :disabled="mode === 'update'"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="item.description" label="description" />
    </v-col>
  </v-row>
</template>
