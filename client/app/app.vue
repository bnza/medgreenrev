<script setup lang="ts">
import type { OpenAPIV3_1 } from 'openapi-types'

const { ready } = storeToRefs(useOpenApiStore())
const name = computed(() => (ready.value ? 'default' : 'empty'))

const { isAuthenticated } = useAppAuth()
const { invalidateQueries } = useQueryCache()

watch(isAuthenticated, () => invalidateQueries())

await $fetch<OpenAPIV3_1.Document>('/api/docs.jsonopenapi', {
  baseURL: useNuxtApp().$config.public.apiBaseUrl,
})
  .then((response) => {
    const { specInternal } = storeToRefs(useOpenApiStore())
    specInternal.value = response
  })
  .catch((e) => {
    console.error('miao', e)
  })
</script>

<template>
  <v-app theme="dark">
    <v-layout data-testid="app-layout">
      <v-main class="d-flex align-center justify-center">
        <NuxtLayout :name>
          <NuxtLoadingIndicator color="warning" />
          <NuxtPage />
        </NuxtLayout>
      </v-main>
    </v-layout>
  </v-app>
</template>
