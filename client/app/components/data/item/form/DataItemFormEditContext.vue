<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PatchItemRequestMap, ResourceParent } from '~~/types'

type Item = PatchItemRequestMap['/api/data/contexts/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'site', '/api/data/sites/{id}'>
}

defineProps<Props>()
defineEmits<{
  'update:item': [value: any]
}>()
</script>

<template>
  <v-card-text class="px-0">
    <v-row>
      <v-col cols="12">
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
      <v-col cols="3">
        <data-autocomplete
          v-model="item.type"
          path="/api/vocabulary/context/types"
          item-title="value"
          label="type"
          :error-messages="errors?.type"
        />
      </v-col>

      <v-col cols="9">
        <v-text-field
          v-model="item.name"
          label="name"
          :error-messages="errors?.name"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="item.description"
          label="description"
          :error-messages="errors?.description"
          rows="3"
        />
      </v-col>
    </v-row>
  </v-card-text>
</template>
