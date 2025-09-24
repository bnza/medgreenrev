<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'
import type { FormDataFields } from '~~/types'

type Item = FormDataFields<'/api/data/media_objects'>

const item = defineModel<Partial<Item>>('item', { required: true })

interface Props {
  errors?: RegleErrorTree<Item>
}

defineProps<Props>()
defineEmits<{
  'update:item': [value: any]
}>()
</script>

<template>
  <v-card-text class="px-0">
    <data-media-object-file-errors-banner-row
      :errors="Array.isArray(errors?.file) ? errors.file : []"
    />
    <v-row>
      <v-col cols="12">
        <v-file-upload
          v-model="item.file"
          clearable
          data-testid="data-dialog-form-file-upload"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <data-autocomplete-hierarchical-vocabulary
          v-model="item.type"
          path="/api/vocabulary/media_object/types"
          label="type"
          :error-messages="errors?.type"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-textarea v-model="item.description" label="description" rows="3" />
      </v-col>
    </v-row>
  </v-card-text>
</template>
