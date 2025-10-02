<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PostCollectionRequestMap, ResourceParent } from '~~/types'

type Item = PostCollectionRequestMap['/api/data/sediment_core_depths']
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  parent?:
    | ResourceParent<'sedimentCore', '/api/data/sediment_cores/{id}'>
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
  errors?: RegleErrorTree<Item>
}

defineProps<Props>()
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete
          v-model="item.sedimentCore"
          path="/api/data/sediment_cores"
          label="sediment core"
          item-title="code"
          :error-messages="errors?.sedimentCore"
          :disabled="parent?.key === 'sedimentCore' || mode === 'update'"
          :granted-only="true"
        />
      </v-col>
      <v-col cols="12" md="6">
        <data-autocomplete-stratigraphic-unit
          v-model="item.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="errors?.stratigraphicUnit"
          :disabled="parent?.key === 'stratigraphicUnit'"
          :granted-only="true"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="item.depthMin"
          :error-messages="errors?.depthMin"
          label="depth (min)"
          :disabled="mode === 'update'"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="item.depthMax"
          :error-messages="errors?.depthMax"
          label="depth (max)"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="item.notes" label="notes" rows="3" />
      </v-col>
    </v-row>
  </v-container>
</template>
