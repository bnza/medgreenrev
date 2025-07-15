<script setup lang="ts">
defineProps<{ status: 'idle' | 'pending' | 'error' | 'success' }>()
</script>

<template>
  <app-bar />
  <app-data-navigation-drawer />
  <NuxtPage />
</template>
