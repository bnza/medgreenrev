<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/analyses/context_botany_taxonomies/{id}']
    readLink?: boolean
  }>(),
  {
    readLink: true,
  },
)
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="6" class="px-2">
        <data-autocomplete-analysis
          :model-value="item.analysis?.analysis"
          disabled
        />
      </v-col>
      <v-col cols="6" class="px-2">
        <data-autocomplete-context
          :model-value="item.analysis?.subject"
          disabled
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="1" class="px-2">
        <v-checkbox :model-value="item.type" label="type" />
      </v-col>
      <v-col cols="1" class="px-2">
        <v-checkbox :model-value="item.cf" label="cf" />
      </v-col>
      <v-col cols="6">
        <v-text-field
          :model-value="item.flat?.value"
          disabled
          label="taxonomy"
        />
      </v-col>
      <v-col cols="1" class="px-2">
        <v-checkbox :model-value="item.sp" label="sp" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
