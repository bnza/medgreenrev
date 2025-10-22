<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { PatchItemRequestMap, PostCollectionRequestMap } from '~~/types'

type Item = Partial<
  PostCollectionRequestMap['/api/data/sites'] &
    PatchItemRequestMap['/api/data/sites/{id}']
>
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Item>
}

defineProps<Props>()
</script>

<template>
  <v-row>
    <v-col cols="4" xs="12" class="px-2">
      <v-text-field
        v-model="item.code"
        label="code"
        :disabled="mode === 'update'"
        :error-messages="errors?.code"
      />
    </v-col>
    <v-col cols="8" xs="12" class="px-2">
      <v-text-field
        v-model="item.name"
        label="name"
        :error-messages="errors?.name"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="4" xs="12" class="px-2">
      <v-text-field
        v-model="item.fieldDirector"
        label="field director"
        :error-messages="errors?.fieldDirector"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="5" class="px-2">
      <v-text-field
        v-model="item.chronologyLower"
        label="chronology (lower)"
        :error-messages="errors?.chronologyLower"
      />
    </v-col>
    <v-col cols="12" xs="5" class="px-2">
      <v-text-field
        v-model="item.chronologyUpper"
        label="chronology (upper)"
        :error-messages="errors?.chronologyUpper"
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <data-selection-vocabulary
        v-model="item.culturalContexts"
        path="/api/vocabulary/cultural_contexts"
        label="cultural contexts"
        multiple
      />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12" xs="12" class="px-2">
      <v-textarea v-model="item.description" label="description" />
    </v-col>
  </v-row>
</template>
