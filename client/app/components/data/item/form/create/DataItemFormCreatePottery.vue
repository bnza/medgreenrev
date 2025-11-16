<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { createRule, type Maybe, useScopedRegle } from '@regle/core'
import { integer, maxValue, minValue, required } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'

const path: ApiResourcePath | PostCollectionPath = '/api/data/potteries'

const props = defineProps<{
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const apiInventoryValidator = new GetValidationOperation(
  '/api/validator/unique/potteries/inventory',
)

const uniqueInventory = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiInventoryValidator.isValid({ inventory: value }) : true,
  message: 'Inventory must be unique',
})

const { r$ } = useScopedRegle(model, {
  stratigraphicUnit: {
    required,
  },
  inventory: {
    required,
    unique: uniqueInventory,
  },
  functionalGroup: {
    required,
  },
  functionalForm: {
    required,
  },
  chronologyLower: {
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    lessThanOrEqual: lessThanOrEqual(
      'Lower chronology must be greater than or equal upper chronology.',
    )(() => model.value.chronologyUpper),
  },
  chronologyUpper: {
    integer,
    minValue: minValue(-32768),
    maxValue: maxValue(new Date().getFullYear()),
    greaterOrEqualThan: greaterThanOrEqual(
      'Upper chronology must be less than or equal lower chronology.',
    )(() => model.value.chronologyLower),
  },
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <data-autocomplete-stratigraphic-unit
          v-model="r$.$value.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="r$.$errors?.stratigraphicUnit"
          :disabled="parent?.key === 'stratigraphicUnit'"
          granted-only
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="r$.$value.inventory"
          :error-messages="r$.$errors?.inventory"
          label="inventory"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="r$.$value.shape"
          path="/api/vocabulary/pottery/shapes"
          item-title="value"
          label="shape"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="r$.$value.functionalGroup"
          path="/api/vocabulary/pottery/functional_groups"
          item-title="value"
          label="functional group"
          :error-messages="r$.$errors?.functionalGroup"
        />
      </v-col>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="r$.$value.functionalForm"
          path="/api/vocabulary/pottery/functional_forms"
          item-title="value"
          label="functional form"
          :error-messages="r$.$errors?.functionalForm"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <data-autocomplete
          v-model="r$.$value.culturalContext"
          path="/api/vocabulary/cultural_contexts"
          item-title="value"
          label="cultural contexts"
          data-testid="cultural-contexts-selection"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="r$.$value.chronologyLower"
          :error-messages="r$.$errors?.chronologyLower"
          label="chronology lower"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-text-field
          v-model.number="r$.$value.chronologyUpper"
          :error-messages="r$.$errors?.chronologyUpper"
          label="chronology upper"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <data-selection-vocabulary
          v-model="r$.$value.surfaceTreatment"
          :multiple="false"
          path="/api/vocabulary/pottery/surface_treatments"
          label="surface treatment"
        />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field v-model="r$.$value.innerColor" label="inner color" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field v-model="r$.$value.outerColor" label="outer color" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <data-selection-vocabulary
          v-model="r$.$value.decorations"
          path="/api/vocabulary/pottery/decorations"
          label="decorations"
          multiple
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8" xs="12" class="px-2">
        <v-text-field
          v-model="r$.$value.decorationMotif"
          label="decoration motif"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="r$.$value.notes" label="notes" rows="3" />
      </v-col>
    </v-row>
  </v-container>
</template>
