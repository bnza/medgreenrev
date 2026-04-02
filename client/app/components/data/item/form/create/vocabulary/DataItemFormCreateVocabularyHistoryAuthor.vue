<script setup lang="ts">
import type { PostCollectionPath } from '~~/types'
import { useScopedRegle } from '@regle/core'
import { required } from '@regle/rules'

const path: PostCollectionPath = '/api/vocabulary/history/authors'

const model = generateEmptyPostModel(path)

const { r$ } = useScopedRegle(model, {
  value: { required },
  variant: {},
})
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field
          v-model="r$.$value.value"
          label="value"
          :error-messages="r$.$errors?.value"
        />
      </v-col>
      <v-col cols="6" xs="12" class="px-2">
        <v-text-field
          v-model="r$.$value.variant"
          label="variant"
          :error-messages="r$.$errors?.variant"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
