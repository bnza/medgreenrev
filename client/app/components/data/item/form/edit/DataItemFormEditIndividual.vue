<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PatchItemRequestMap, ResourceParent } from '~~/types'

type Item = PatchItemRequestMap['/api/data/individuals/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  parent?: ResourceParent<
    'stratigraphicUnit',
    '/api/data/stratigraphic_units/{id}'
  >
  errors?: RegleErrorTree<Partial<Item>>
}

const props = defineProps<Props>()
defineEmits<{
  'update:item': [value: any]
}>()

const disabled = computed(
  () => props.parent?.key === 'stratigraphicUnit' || props.mode === 'update',
)
</script>

<template>
  <v-card-text class="px-0">
    <v-row>
      <v-col cols="4">
        <data-autocomplete-stratigraphic-unit
          v-model="item.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="errors?.stratigraphicUnit"
          :disabled
          :granted-only="!disabled"
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="item.identifier"
          label="identifier"
          :error-messages="errors?.identifier"
          :disabled="mode === 'update'"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <data-selection-individual-sex
          v-model="item.sex"
          path="/api/vocabulary/pottery/shapes"
          item-title="value"
          label="sex"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="item.age"
          path="/api/vocabulary/individual/age"
          item-title="value"
          label="age"
          :error-messages="errors?.age"
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
