<script setup lang="ts">
defineProps<{ status: 'idle' | 'pending' | 'error' | 'success' }>()
</script>
<template>
  <resource-not-found
    v-if="status === 'error'"
    error="API spec could not be loaded"
    :back="false"
    title="Application error"
  />
  <v-container v-else>
    <v-row justify="center" style="margin-top: 78px">
      <home-page-logo />
    </v-row>
    <v-row justify="center">
      <v-progress-linear
        indeterminate
        color="warning"
        class="mt-8"
        style="width: 480px"
      />
    </v-row>
  </v-container>
</template>
