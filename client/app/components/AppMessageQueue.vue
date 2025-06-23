<script setup lang="ts">
const messages = useMessagesStore()
</script>

<template>
  <v-snackbar-queue v-model="messages.queue" close-on-content-click location="top"></v-snackbar-queue>
</template>
