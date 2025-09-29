<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/analyses/sites/anthropology/{id}']
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
      <v-col cols="4" class="px-2">
        <v-text-field :model-value="item.subject?.code" label="site">
          <template v-if="item.subject?.['@id']" #append-inner>
            <data-item-info-box-site :iri="item.subject?.['@id']" :read-link />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2" class="px-2">
        <v-text-field :model-value="item.analysis?.type?.group" label="group" />
      </v-col>
      <v-col cols="2" class="px-2">
        <v-text-field :model-value="item.analysis?.type?.value" label="type" />
      </v-col>
      <v-col cols="4" class="px-2">
        <v-text-field :model-value="item.analysis?.identifier" label="analysis">
          <template v-if="item.analysis?.['@id']" #append-inner>
            <data-item-info-box-analysis
              :iri="item.analysis?.['@id']"
              :read-link
            />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="px-2">
        <v-textarea :model-value="item.summary" label="summary" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
