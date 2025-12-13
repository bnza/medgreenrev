<script setup lang="ts">
defineProps<{ status: 'idle' | 'pending' | 'error' | 'success' }>()
const { state } = storeToRefs(useAppUiModeStore())
</script>

<template>
  <app-bar />
  <app-data-navigation-drawer />
  <KeepAlive>
    <Suspense v-if="state === 'map'">
      <template #default>
        <lazy-app-map />
      </template>
      <template #fallback>
        <loading-component />
      </template>
    </Suspense>
  </KeepAlive>
  <KeepAlive>
    <NuxtPage v-if="state === 'default'" />
  </KeepAlive>
</template>
