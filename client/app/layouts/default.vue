<script setup lang="ts">
defineProps<{ status: 'idle' | 'pending' | 'error' | 'success' }>()
const { state: mode } = storeToRefs(useAppUiModeStore())
</script>

<template>
  <app-bar />
  <app-data-navigation-drawer v-if="mode === 'default'" />
  <app-map-navigation-drawer v-if="mode === 'map'" />
  <KeepAlive>
    <Suspense v-if="mode === 'map'">
      <template #default>
        <lazy-app-map />
      </template>
      <template #fallback>
        <loading-component />
      </template>
    </Suspense>
  </KeepAlive>
  <KeepAlive>
    <NuxtPage v-if="mode === 'default'" />
  </KeepAlive>
</template>
