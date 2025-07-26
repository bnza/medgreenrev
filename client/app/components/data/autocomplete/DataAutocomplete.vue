<script setup lang="ts">
import type { ApiResourcePath } from '~/utils/consts/resources'
import useAutocompleteQuery from '~/composables/queries/useAutocompleteQuery'

const model = defineModel<string | { '@id': string }>()
const props = defineProps<{
  path: ApiResourcePath
  itemTitle: string
}>()

const search = ref('')
const { items, asyncStatus } = useAutocompleteQuery(props.path, search)
const iri = computed({
  get() {
    return isString(model.value) ? model.value : model.value?.['@id']
  },
  set(value) {
    if (isString(model.value) || typeof model.value === 'undefined') {
      model.value = value
    } else {
      model.value['@id'] = value!
    }
  },
})
</script>

<template>
  <v-autocomplete
    v-model="iri"
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
