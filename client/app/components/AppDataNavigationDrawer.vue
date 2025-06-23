<script setup lang="ts">

const {visible, dataOpened} = storeToRefs(useDataNavigationDrawerStore())
</script>

<template>

  <v-navigation-drawer
    :model-value="visible"
    :permanent="true"
    data-testid="app-navigation-drawer"
  >
  </v-navigation-drawer>
</template>


