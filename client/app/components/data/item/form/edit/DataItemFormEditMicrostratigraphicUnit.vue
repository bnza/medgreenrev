<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PatchItemRequestMap, ResourceParent } from '~~/types'

type Item = PatchItemRequestMap['/api/data/microstratigraphic_units/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  parent?: ResourceParent<'stratigraphicUnit'>
  errors?: RegleErrorTree<Partial<Item>>
}

defineProps<Props>()
defineEmits<{
  'update:item': [value: any]
}>()
</script>

<template>
  <v-card-text class="px-0">
    <v-row>
      <v-col cols="6">
        <data-autocomplete-stratigraphic-unit
          v-model="item.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="errors?.stratigraphicUnit"
          :disabled="parent?.key === 'stratigraphicUnit' || mode === 'update'"
          :granted-only="true"
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          v-model="item.identifier"
          label="identifier"
          :error-messages="errors?.identifier"
          :disabled="mode === 'update'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="item.notes" label="notes" rows="3" />
      </v-col>
    </v-row>
  </v-card-text>
</template>
