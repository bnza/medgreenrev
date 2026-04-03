<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { numeric, required } from '@regle/rules'

type Path = '/api/data/sediment_core_depths/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  stratigraphicUnit: {
    required,
  },
  depthMax: {
    required,
    numeric,
    greaterThan: greaterThan('Max depth must be greater than min depth.')(
      () => model.value.depthMin,
    ),
  },
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <data-autocomplete
          v-model="r$.$value.sedimentCore"
          path="/api/data/sediment_cores"
          label="sediment core"
          item-title="code"
          disabled
          :error-messages="r$.$errors?.sedimentCore"
        />
      </v-col>
      <v-col cols="12" md="6">
        <data-autocomplete-stratigraphic-unit
          v-model="r$.$value.stratigraphicUnit"
          path="/api/data/stratigraphic_units"
          label="stratigraphic unit"
          item-title="code"
          :error-messages="r$.$errors?.stratigraphicUnit"
          :query-params="{ site: fetchedItem?.stratigraphicUnit.site?.['@id'] }"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="r$.$value.depthMin"
          :error-messages="r$.$errors?.depthMin"
          label="depth (min)"
          disabled
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="r$.$value.depthMax"
          :error-messages="r$.$errors?.depthMax"
          label="depth (max)"
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
