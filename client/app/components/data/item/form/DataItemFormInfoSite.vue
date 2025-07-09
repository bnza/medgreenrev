<script setup lang="ts">
import type {GetItemResponseMap} from "~~/types";

defineProps<{
  item: GetItemResponseMap['/api/sites/{id}']
}>()
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="12" xs="6" sm="2" class="px-2">
        <v-text-field
          :model-value="item.code"
          label="code"
        />
      </v-col>
      <v-col cols="12" xs="6" sm="2" class="px-2">
        <v-text-field
          :model-value="item.name"
          label="name"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea v-model="item.description" label="description"/>
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
