<script setup lang="ts">
import type { ApiResourcePath } from '~/utils/consts/resources'
import useAutocompleteQuery from '~/composables/queries/useAutocompleteQuery'

const model = defineModel<string>()
const props = defineProps<{
  path: ApiResourcePath
  itemTitle: string
}>()

const search = ref('')
const { items, asyncStatus } = useAutocompleteQuery(props.path, search)
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
