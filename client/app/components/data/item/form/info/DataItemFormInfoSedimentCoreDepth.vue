<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

withDefaults(
  defineProps<{
    item: GetItemResponseMap['/api/data/sediment_core_depths/{id}']
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
        <v-text-field :model-value="item.sedimentCore.site.name" label="site">
          <template v-if="item.sedimentCore.site['@id']" #append-inner>
            <data-item-info-box-site
              :iri="item.sedimentCore.site['@id']"
              :read-link
            />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field
          :model-value="item.sedimentCore.code"
          label="sediment core"
        >
          <template v-if="item.sedimentCore['@id']" #append-inner>
            <data-item-info-box-sediment-core
              :iri="item.sedimentCore['@id']"
              :read-link
            />
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.stratigraphicUnit.code" label="SU">
          <template v-if="item.stratigraphicUnit['@id']" #append-inner>
            <data-item-info-box-stratigraphic-unit
              :iri="item.stratigraphicUnit['@id']"
              :read-link
            />
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.depthMin" label="depth (min)" />
      </v-col>
      <v-col cols="4" xs="12" class="px-2">
        <v-text-field :model-value="item.depthMax" label="depth (max)" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" xs="12" class="px-2">
        <v-textarea :model-value="item.notes" label="notes" />
      </v-col>
    </v-row>
  </data-item-form-read>
</template>
