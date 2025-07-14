<script setup lang="ts">
import type { RegleErrorTree } from '@regle/core'

type Item = { code?: string; name?: string; description?: string | null }
const item = defineModel<Item>('item', { required: true })

interface Props {
  mode: 'create' | 'update'
  errors?: RegleErrorTree<Item>
}

const props = defineProps<Props>()
</script>

<template>
  <v-row>
    <v-text-field
      v-model="item.code"
      label="code"
      :disabled="mode === 'update'"
      :error-messages="errors?.code"
    />
  </v-row>
  <v-row>
    <v-text-field
      v-model="item.name"
      label="name"
      :error-messages="errors?.name"
    />
  </v-row>
  <v-row>
    <v-textarea v-model="item.description" label="description" />
  </v-row>
</template>
