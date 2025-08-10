<script setup lang="ts">
import { PiniaColadaDevtools } from '@pinia/colada-devtools'

const apiStore = useOpenApiStore()
const { ready, status } = storeToRefs(apiStore)

const name = computed(() => (ready.value ? undefined : 'loading'))

apiStore.fetchSpec()

const { isAuthenticated } = useAppAuth()
const { removeCachedAuthQueries } = useRemoveCachedAuthQueries()
const { invalidateQueries } = useQueryCache()

watch(isAuthenticated, (value) => {
  if (!value) {
    removeCachedAuthQueries()
    invalidateQueries()
  }
})
</script>

<template>
  <v-app theme="dark">
    <v-layout data-testid="app-layout">
      <v-main class="d-flex align-center justify-center">
        <NuxtLayout :name :status>
          <NuxtLoadingIndicator color="warning" />
          <NuxtPage />
        </NuxtLayout>
      </v-main>
      <app-message-queue />
    </v-layout>
  </v-app>
  <PiniaColadaDevtools />
</template>
