<script setup lang="ts">
import type { PatchItemRequestMap, ResourceParent } from '~~/types'
import type { RegleErrorTree } from '@regle/core'

type Item = PatchItemRequestMap['/api/data/potteries/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

defineProps<{
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<
    'stratigraphicUnit',
    '/api/data/stratigraphic_units/{id}'
  >
}>()

defineEmits<{
  submit: []
}>()
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
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
      <v-col cols="12" md="4">
        <v-text-field
          v-model="item.inventory"
          :error-messages="errors?.inventory"
          label="inventory"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="item.shape"
          path="/api/vocabulary/pottery/shapes"
          item-title="value"
          label="shape"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="item.functionalGroup"
          path="/api/vocabulary/pottery/functional_groups"
          item-title="value"
          label="functional group"
          :error-messages="errors?.functionalGroup"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="item.functionalForm"
          path="/api/vocabulary/pottery/functional_forms"
          item-title="value"
          label="functional form"
          :error-messages="errors?.functionalForm"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="item.culturalContext"
          path="/api/vocabulary/cultural_contexts"
          item-title="value"
          label="cultural contexts"
          data-testid="cultural-contexts-selection"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="item.chronologyLower"
          :error-messages="errors?.chronologyLower"
          label="chronology lower"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="item.chronologyUpper"
          :error-messages="errors?.chronologyUpper"
          label="chronology upper"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <data-selection-vocabulary
          v-model="item.surfaceTreatment"
          path="/api/vocabulary/pottery/surface_treatments"
          label="surface treatment"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field v-model="item.innerColor" label="inner color" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field v-model="item.outerColor" label="outer color" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <data-selection-vocabulary
          v-model="item.decorations"
          path="/api/vocabulary/pottery/decorations"
          label="decorations"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" xs="12" class="px-2">
        <v-text-field v-model="item.decorationMotif" label="decoration motif" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="item.notes" label="notes" rows="3" />
      </v-col>
    </v-row>
  </v-container>
</template>
