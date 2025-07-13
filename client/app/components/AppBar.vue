<script setup lang="ts">
const { toggleVisible } = useDataNavigationDrawerStore()
</script>

<template>
  <v-app-bar color="primary" height="48" flat>
    <template #prepend>
      <v-app-bar-nav-icon
        data-testid="app-bar-nav-icon"
        @click.stop="toggleVisible()"
      />
    </template>
    <template #append>
      <auth-app-bar-icon />
    </template>
  </v-app-bar>
</template>
