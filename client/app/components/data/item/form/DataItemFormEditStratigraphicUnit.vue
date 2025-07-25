<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PatchItemRequestMap, ResourceParent } from '~~/types'

type Item = PatchItemRequestMap['/api/stratigraphic_units/{id}']

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Partial<Item>>
  parent?: ResourceParent<'site', '/api/sites/{id}'>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="4">
      <data-autocomplete-site
        v-model="item.site"
        path="/api/sites"
        item-title="name"
        label="site"
        :error-messages="errors?.site"
        :disabled="parent?.key === 'site' || mode === 'update'"
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field
        v-model="item.year"
        label="year"
        :error-messages="errors?.year"
        :disabled="mode === 'update'"
      />
    </v-col>
    <v-col cols="4" class="px-2">
      <v-text-field
        v-model="item.number"
        label="number"
        :error-messages="errors?.number"
        :disabled="mode === 'update'"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="item.interpretation" label="interpretation" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="item.description" label="description" />
    </v-col>
  </v-row>
</template>
