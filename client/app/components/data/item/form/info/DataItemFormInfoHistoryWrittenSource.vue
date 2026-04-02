<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

const props = defineProps<{
  item: GetItemResponseMap['/api/data/history/written_sources/{id}']
}>()

const centuries = props.item.centuries?.map(
  (century) => century['@id'] as string,
)
</script>

<template>
  <data-item-form-read>
    <v-row>
      <v-col cols="12" xs="12" sm="4" class="px-2">
        <data-autocomplete
          path="/api/vocabulary/history/written_source_types"
          :model-value="item.writtenSourceType"
          label="type"
          item-title="value"
          multiple
        />
      </v-col>
      <v-col cols="12" xs="12" sm="8" class="px-2">
        <data-autocomplete
          path="/api/vocabulary/centuries"
          :model-value="centuries"
          label="century"
          item-title="value"
          multiple
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="4" class="px-2">
        <v-text-field :model-value="item.author.value" label="author" />
      </v-col>
      <v-col cols="12" xs="12" sm="8" class="px-2">
        <v-text-field :model-value="item.title" label="title" />
      </v-col>
    </v-row>
    <v-row v-if="item.subtitle">
      <v-col cols="12" class="px-2">
        <v-text-field :model-value="item.subtitle" label="subtitle" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" sm="12" class="px-2">
        <v-text-field
          :model-value="item.publicationDetails"
          label="publication details"
        />
      </v-col>
    </v-row>
    <v-row v-if="item.notes">
      <v-col cols="12" class="px-2">
        <v-textarea :model-value="item.notes" label="notes" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
