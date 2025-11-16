<script setup lang="ts">
import { useScopedRegle } from '@regle/core'
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'

type Path = '/api/data/stratigraphic_units/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {})
</script>

<template>
  <v-row>
    <v-col cols="4">
      <data-autocomplete-site
        v-model="r$.$value.site"
        path="/api/data/sites"
        item-title="name"
        label="site"
        granted-only
        :error-messages="r$.$errors.site"
        disabled
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field
        v-model.number="r$.$value.year"
        label="year"
        :error-messages="r$.$errors.year"
        disabled
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field
        v-model.number="r$.$value.number"
        label="number"
        :error-messages="r$.$errors.number"
        disabled
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="r$.$value.interpretation" label="interpretation" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="r$.$value.description" label="description" />
    </v-col>
  </v-row>
</template>
