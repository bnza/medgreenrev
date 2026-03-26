<script setup lang="ts">
import type { VocabularyGetCollectionPath } from '~~/types'

const model = defineModel<string>()

interface Props {
  path: VocabularyGetCollectionPath
}

const props = defineProps<Props>()
</script>

<template>
  <data-autocomplete v-model="model" :path="props.path" item-title="value">
    <template #item="{ item, props: itemProps }">
      <v-list-item v-if="item.value" v-bind="itemProps">
        <span class="text-body-medium text-grey-lighten-1"
          >{{ item.group }} \ {{ item.value }}</span
        >
      </v-list-item>
    </template>
    <template #selection="{ item }">
      <v-list-item v-if="item.value">
        <span class="text-grey-lighten-1">{{ item.group }} \ </span
        >{{ item.value }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
