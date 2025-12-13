<script setup lang="ts">
const { toggleVisible } = useDataNavigationDrawerStore()
</script>

<template>
  <v-app-bar color="primary" height="48" flat data-testid="app-bar">
    <template #prepend>
      <v-app-bar-nav-icon
        data-testid="app-bar-nav-icon"
        @click.stop="toggleVisible()"
      />
    </template>
    <ui-mode-switcher />
    <template #append>
      <auth-app-bar-icon />
    </template>
  </v-app-bar>
</template>
