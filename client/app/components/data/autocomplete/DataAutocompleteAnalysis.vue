<script setup lang="ts">
import type { ApiResourcePath, JsonLdItem } from '~~/types'

const model = defineModel<string>()
interface Props {
  path?: ApiResourcePath
  itemTitle?: string
  grantedOnly?: boolean
  queryParams?: Record<string, any>
}
const props = withDefaults(defineProps<Props>(), {
  grantedOnly: false,
  itemTitle: 'code',
  path: '/api/data/analyses',
})

const emit = defineEmits<{
  selected: [item: JsonLdItem | undefined]
}>()
</script>

<template>
  <data-autocomplete
    v-model="model"
    label="analysis"
    :path="props.path"
    :item-title="props.itemTitle"
    :granted-only
    :query-params
    @selected="emit('selected', $event)"
  >
    <template #selection="{ item }">
      <v-list-item v-if="item.raw.code">
        <span class="text-secondary font-weight-bold">{{
          item.raw.type.code
        }}</span>
        - {{ item.raw.code }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
