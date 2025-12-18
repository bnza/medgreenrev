<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { required } from '@regle/rules'

type Path = '/api/data/zoo/bones/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  taxonomy: { required },
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <data-autocomplete-stratigraphic-unit
        v-model="r$.$value.stratigraphicUnit"
        path="/api/data/stratigraphic_units"
        label="stratigraphic unit"
        item-title="code"
        disabled
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
        :error-messages="r$.$errors.taxonomy"
        clearable
      />
    </v-col>
    <v-col cols="12" md="3">
      <data-autocomplete
        v-model="r$.$value.element"
        path="/api/vocabulary/zoo/bones"
        item-title="value"
        label="element"
        clearable
      />
    </v-col>
    <v-col cols="12" md="3">
      <data-autocomplete
        v-model="r$.$value.part"
        path="/api/vocabulary/zoo/bone_parts"
        item-title="value"
        label="part"
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
      <v-textarea v-model="r$.$value.notes" label="notes" rows="3" />
    </v-col>
  </v-row>
</template>
