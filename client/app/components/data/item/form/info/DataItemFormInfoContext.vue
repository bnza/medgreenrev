<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/contexts/{id}']
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
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.site?.name" label="site">
          <template v-if="item.site?.['@id']" #append-inner>
            <data-item-info-box-site :iri="item.site?.['@id']" :read-link />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.type" label="type" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.name" label="name" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.description" label="description" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
