<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { minLength, required } from '@regle/rules'

type Path = '/api/data/history/written_sources/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  writtenSourceType: {
    required,
  },
  author: {
    required,
  },
  title: {
    required,
  },
  publicationDetails: {
    required,
  },
  centuries: {
    required,
    minLength: minLength(1),
  },
} as any)
</script>

<template>
  <v-row>
    <v-col cols="6" class="px-2">
      <data-autocomplete
        v-model="r$.$value.writtenSourceType"
        path="/api/vocabulary/history/written_source_types"
        item-title="value"
        label="written source type"
        :error-messages="r$.$errors?.writtenSourceType"
      />
    </v-col>
    <v-col cols="6" class="px-2">
      <data-autocomplete
        v-model="r$.$value.author"
        path="/api/vocabulary/history/authors"
        item-title="value"
        label="author"
        :error-messages="r$.$errors?.author"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-text-field
        v-model="r$.$value.title"
        label="title"
        :error-messages="r$.$errors?.title"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-text-field
        v-model="r$.$value.subtitle"
        label="subtitle"
        :error-messages="r$.$errors?.subtitle"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-text-field
        v-model="r$.$value.publicationDetails"
        label="publication details"
        :error-messages="r$.$errors?.publicationDetails"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <data-selection-vocabulary
        v-model="r$.$value.centuries"
        path="/api/vocabulary/centuries"
        label="centuries"
        :error-messages="r$.$errors?.centuries?.$self"
        multiple
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" class="px-2">
      <v-textarea
        v-model="r$.$value.notes"
        label="notes"
        :error-messages="r$.$errors?.notes"
      />
    </v-col>
  </v-row>
</template>
