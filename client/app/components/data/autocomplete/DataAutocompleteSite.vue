<script setup lang="ts">
import type { ApiResourcePath } from '~/utils/consts/resources'

const model = defineModel<string>()
const props = withDefaults(
  defineProps<{
    path: ApiResourcePath
    itemTitle: string
    grantedOnly?: boolean
  }>(),
  { grantedOnly: false },
)
</script>

<template>
  <data-autocomplete
    v-model="model"
    :path="props.path"
    :item-title="props.itemTitle"
    :granted-only
  >
    <template #selection="{ item }">
      <v-list-item>
        <span class="text-secondary font-weight-bold">{{ item.raw.code }}</span>
        - {{ item.raw.name }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
