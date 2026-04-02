<script setup lang="ts">
import type { ApiResourcePath } from '~~/types'
import { boolean } from '@regle/rules'

const model = defineModel<string>()

withDefaults(defineProps<{ readonly?: boolean }>(), { readonly: false })

const path: ApiResourcePath = '/api/data/history/written_sources'
</script>

<template>
  <data-autocomplete
    v-model="model"
    :path
    item-title="title"
    :clearable="!readonly"
    :readonly
  >
    <template #item="{ item, props: slotProps }">
      <v-list-item v-if="item.author" v-bind="slotProps" :title="undefined">
        <span class="text-grey-darken-1">{{ item.author.value }}</span>
        - {{ item.title }}
      </v-list-item>
    </template>
    <template #selection="{ item }">
      <v-list-item v-if="item.author">
        <span class="text-secondary">{{ item.author.value }}</span>
        - {{ item.title }}
      </v-list-item>
    </template>
  </data-autocomplete>
</template>
