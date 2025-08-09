<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PostCollectionRequestMap, ResourceParent } from '~~/types'

type Item = PostCollectionRequestMap['/api/data/sample_stratigraphic_units']
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  parent?:
    | ResourceParent<'sample', '/api/data/samples/{id}'>
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
  errors?: RegleErrorTree<Item>
}

defineProps<Props>()
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete-sample
          v-model="item.sample"
          :path="'/api/data/samples'"
          item-title="code"
          :error-messages="errors?.sample"
          :disabled="parent?.key === 'sample'"
          :granted-only="true"
        />
      </v-col>
      <v-col cols="12" md="6">
        <data-autocomplete-context
          v-model="item.stratigraphicUnit"
          :path="'/api/data/contexts'"
          item-title="name"
          :error-messages="errors?.stratigraphicUnit"
          :disabled="parent?.key === 'stratigraphicUnit'"
          :granted-only="true"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
