<script setup lang="ts">
import type { ApiResourcePath } from '~~/types'

const model = defineModel<string>()
interface Props {
  path?: ApiResourcePath
  itemTitle?: string
  grantedOnly?: boolean
  queryParams?: Record<string, any>
}
const props = withDefaults(defineProps<Props>(), {
  grantedOnly: false,
  itemTitle: 'identifier',
  path: '/api/data/analyses',
})
</script>

<template>
  <data-autocomplete
    v-model="model"
    :path="props.path"
    :item-title="props.itemTitle"
    :granted-only
    :query-params
  >
    <template #selection="{ item }">
      <v-list-item v-if="item.raw.identifier">
        <span class="text-secondary font-weight-bold">{{
          item.raw.type.code
        }}</span>
        - {{ item.raw.identifier }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
