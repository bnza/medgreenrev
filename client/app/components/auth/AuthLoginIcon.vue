<script setup lang="ts">
const route = useRoute()
const { push } = useHistoryStackStore()
</script>

<template>
  <v-btn
    icon
    nuxt
    to="/login"
    data-testid="login-button"
    @click="push({ path: route.fullPath, isUserAction: true })"
  >
    <v-icon class="mx-3" icon="fas fa-right-to-bracket" />
    <v-tooltip activator="parent" location="bottom">Login</v-tooltip>
  </v-btn>
</template>
