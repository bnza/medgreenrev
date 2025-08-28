<script setup lang="ts">
import type { GetItemResponseMap } from '~~/types'

const model = defineModel<
  GetItemResponseMap['/api/data/media_objects/{id}'] | undefined
>({ required: true })

defineProps<{ readonly: boolean }>()

const dataMediaObjectDialogCreatVisible = ref(false)
</script>

<template>
  <v-text-field :model-value="model?.mimeType" readonly flat>
    <template v-if="!readonly" #prepend-inner>
      <v-icon
        icon="fa fa-upload"
        size="small"
        @click="dataMediaObjectDialogCreatVisible = true"
      >
        <v-tooltip activator="parent" location="bottom"> select </v-tooltip>
      </v-icon>
      <data-media-object-dialog-create
        v-model="model"
        v-model:visible="dataMediaObjectDialogCreatVisible"
      />
    </template>
    <template v-if="!readonly" #clear>
      <v-icon icon="fa fa-circle-xmark" size="small" @click="model = undefined">
        <v-tooltip activator="parent" location="bottom"> clear </v-tooltip>
      </v-icon>
    </template>
  </v-text-field>
</template>
