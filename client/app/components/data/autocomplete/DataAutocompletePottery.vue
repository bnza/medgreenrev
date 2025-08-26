<script setup lang="ts">
import type { ApiResourcePath } from '~~/types'

const model = defineModel<string>()
interface Props {
  path: ApiResourcePath
  itemTitle: string
  grantedOnly?: boolean
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
  >
    <template #selection="{ item }">
      <v-list-item v-if="item.raw.site">
        <span class="text-secondary font-weight-bold">{{
          item.raw.site.code
        }}</span>
        - {{ item.raw.inventory }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
