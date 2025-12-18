<script setup lang="ts">
import type { GetItemResponseMap, PatchItemRequestMap } from '~~/types'
import { required } from '@regle/rules'

type Path = '/api/data/contexts/{id}'
const props = defineProps<{
  initialValue: PatchItemRequestMap[Path]
  fetchedItem?: GetItemResponseMap[Path]
}>()

const model = ref(structuredClone(props.initialValue))

const { r$ } = useScopedRegle(model, {
  type: { required },
  name: { required },
})
</script>

<template>
  <v-card-text class="px-0">
    <v-row>
      <v-col cols="12">
        <data-autocomplete-site
          v-model="r$.$value.site"
          path="/api/data/sites"
          item-title="name"
          label="site"
          granted-only
          :error-messages="r$.$errors?.site"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <data-selection-list
          v-model="r$.$value.type"
          path="/api/list/contexts/types"
          label="type"
          :error-messages="r$.$errors?.type"
        />
      </v-col>
      <v-col cols="8">
        <v-text-field
          v-model="r$.$value.name"
          label="name"
          :error-messages="r$.$errors?.name"
          required
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea
          v-model="r$.$value.description"
          label="description"
          rows="3"
        />
      </v-col>
    </v-row>
  </v-card-text>
</template>
