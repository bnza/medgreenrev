<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PatchItemRequestMap, ResourceParent } from '~~/types'

type Item = PatchItemRequestMap['/api/data/contexts/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'site'>
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
      <v-col cols="4">
        <data-selection-list
          v-model="item.type"
          path="/api/list/contexts/types"
          label="type"
        />
      </v-col>
      <v-col cols="8">
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
