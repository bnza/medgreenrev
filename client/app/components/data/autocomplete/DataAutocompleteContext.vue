<script setup lang="ts">
import type { ApiResourcePath } from '~/utils/consts/resources'

const model = defineModel<string>()
const props = defineProps<{
  path: ApiResourcePath
  itemTitle: string
}>()
</script>

<template>
  <data-autocomplete
    v-model="model"
    :path="props.path"
    :item-title="props.itemTitle"
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
