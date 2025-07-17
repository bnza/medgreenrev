<script setup lang="ts">
import { useAutocomplete } from '~/composables/queries/useAutocomplete'
import type { ApiResourcePath } from '~/utils/consts/resources'

const model = defineModel()
const props = defineProps<{
  path: ApiResourcePath
  itemTitle: string
}>()

const { items, asyncStatus, search } = useAutocomplete(props.path)
</script>

<template>
  <v-autocomplete
    v-model="model"
    no-filter
    item-value="@id"
    :items="items || []"
    :item-title
    :loading="asyncStatus === 'loading'"
    :search
    @update:search="
      (event) => {
        search = event
      }
    "
  >
    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot :name v-bind="slotProps || {}" />
    </template>
  </v-autocomplete>
</template>
