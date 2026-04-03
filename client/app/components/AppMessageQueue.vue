<script setup lang="ts">
const messages = useMessagesStore()
</script>

<template>
  <v-snackbar-queue
    v-model="messages.queue"
    close-on-content-click
    location="top"
  >
    <template #text="prop">
      <span data-testid="app-message">{{ prop.item.text }}</span>
    </template>
  </v-snackbar-queue>
</template>
