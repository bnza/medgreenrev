<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/data/context_samples/{id}']
}>()
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="2">
        <v-text-field label="site" :model-value="item.context?.site?.code" />
      </v-col>
      <v-col cols="10">
        <v-text-field label="name" :model-value="item.context?.site?.name" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-text-field
          label="context type"
          :model-value="item.context?.type?.value"
        />
      </v-col>
      <v-col cols="10">
        <v-text-field label="context name" :model-value="item.context?.name" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-text-field
          label="sample type"
          :model-value="item.sample?.type?.value"
        />
      </v-col>
      <v-col cols="10">
        <v-text-field label="sample code" :model-value="item.sample?.code" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
