<script setup lang="ts">
import type {
  ApiResourcePath,
  PostCollectionPath,
  ResourceParent,
} from '~~/types'
import { useScopedRegle } from '@regle/core'
import { required } from '@regle/rules'

const path: ApiResourcePath | PostCollectionPath = '/api/data/zoo/bones'

const props = defineProps<{
  parent?: ResourceParent<'stratigraphicUnit'>
}>()

const model = generateEmptyPostModel(path, props.parent)

const { r$ } = useScopedRegle(model, {
  stratigraphicUnit: { required },
  taxonomy: { required },
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
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
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete
          v-model="r$.$value.taxonomy"
          path="/api/vocabulary/zoo/taxonomies"
          item-title="value"
          label="species"
          :error-messages="r$.$errors?.taxonomy"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <data-autocomplete
          v-model="r$.$value.element"
          path="/api/vocabulary/zoo/bones"
          item-title="value"
          label="element"
          :error-messages="r$.$errors?.element"
          clearable
        />
      </v-col>
      <v-col cols="12" md="3">
        <data-autocomplete
          v-model="r$.$value.part"
          path="/api/vocabulary/zoo/bone_parts"
          item-title="value"
          label="part"
          :error-messages="r$.$errors?.part"
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <data-selection-zoo-bone-ends-preserved
          v-model.number="r$.$value.endsPreserved"
          :multiple="false"
        />
      </v-col>
      <v-col cols="12" md="3">
        <data-selection-zoo-bone-side
          v-model="r$.$value.side"
          :multiple="false"
          clearable
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="r$.$value.notes"
          label="notes"
          rows="3"
          :error-messages="r$.$errors?.notes"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
