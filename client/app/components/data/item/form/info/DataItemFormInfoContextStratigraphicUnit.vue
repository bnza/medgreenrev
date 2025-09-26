<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

defineProps<{
  item: GetItemResponseMap['/api/data/context_stratigraphic_units/{id}']
}>()
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="4">
        <v-text-field
          label="stratigraphic unit"
          :model-value="item.stratigraphicUnit?.code"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field
          label="interpretation"
          :model-value="item.stratigraphicUnit?.interpretation"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-text-field
          label="context type"
          :model-value="item.context?.type?.value"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field label="site" :model-value="item.context?.site?.code" />
      </v-col>
      <v-col cols="6">
        <v-text-field label="name" :model-value="item.context?.site?.name" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
