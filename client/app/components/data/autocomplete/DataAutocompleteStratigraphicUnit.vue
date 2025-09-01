<script setup lang="ts">
import type { ApiResourcePath } from '~~/types'

const model = defineModel<string>()

// @TODO remove path, hardcode it
interface Props {
  path: ApiResourcePath
  itemTitle: string
  grantedOnly?: boolean
  queryParam?: Record<string, any>
}
const props = withDefaults(defineProps<Props>(), {
  grantedOnly: false,
})
</script>

<template>
  <data-autocomplete
    v-model="model"
    :path="props.path"
    :item-title="props.itemTitle"
    :granted-only
    :query-params="props.queryParam"
  >
    <template #selection="{ item }">
      <v-list-item v-if="item.raw.site">
        <span class="text-secondary font-weight-bold">{{
          item.raw.site.code
        }}</span>
        - {{ item.raw.code }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
