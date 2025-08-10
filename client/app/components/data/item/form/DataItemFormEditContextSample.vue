<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PostCollectionRequestMap, ResourceParent } from '~~/types'

type Item = PostCollectionRequestMap['/api/data/context_samples']
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  parent?:
    | ResourceParent<'sample', '/api/data/samples/{id}'>
    | ResourceParent<'context', '/api/data/contexts/{id}'>
  errors?: RegleErrorTree<Item>
}

defineProps<Props>()
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete-context
          v-model="item.context"
          item-title="name"
          label="context"
          path="/api/data/contexts"
          :error-messages="errors?.context"
          :disabled="parent?.key === 'context'"
          :granted-only="true"
        />
      </v-col>
      <v-col cols="12" md="6">
        <data-autocomplete-sample
          v-model="item.sample"
          item-title="code"
          label="sample"
          path="/api/data/samples"
          :error-messages="errors?.sample"
          :disabled="parent?.key === 'sample'"
          :granted-only="true"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
