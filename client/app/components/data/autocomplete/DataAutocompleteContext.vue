<script setup lang="ts">
import type { DataAutocompleteComponentProps } from '~~/types'

const model = defineModel<string>()
const props = withDefaults(defineProps<DataAutocompleteComponentProps>(), {
  grantedOnly: false,
})
</script>

<template>
  <data-autocomplete
    v-model="model"
    :path="props.path"
    :item-title="props.itemTitle"
    :granted-only
  >
    <template #selection="{ item }">
      <v-list-item v-if="item.raw.site">
        <span class="text-secondary font-weight-bold">{{
          item.raw.site.code
        }}</span>
        - {{ item.raw.name }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
