<script setup lang="ts">
import { PiniaColadaDevtools } from '@pinia/colada-devtools'

const apiStore = useOpenApiStore()
const { ready, status } = storeToRefs(apiStore)

const name = computed(() => (ready.value ? 'default' : 'empty'))

apiStore.fetchSpec()

// Refresh queries on auth changes
const { isAuthenticated } = useAppAuth()
const { invalidateQueries } = useQueryCache()

watch(isAuthenticated, () => invalidateQueries())
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
