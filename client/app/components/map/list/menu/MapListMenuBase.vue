<script setup lang="ts">
const model = defineModel<boolean>()
defineSlots<{
  default(): any
}>()
</script>

<template>
  <v-btn data-testid="map-list-menu-base" icon>
    <v-icon size="xsmall" icon="fas fa-ellipsis-vertical" />
    <v-tooltip activator="parent" location="bottom">Settings</v-tooltip>
    <v-menu
      v-model="model"
      activator="parent"
      data-testid="map-list-menu-base-menu"
      :close-on-content-click="false"
    >
      <v-list dense>
        <slot />
      </v-list>
    </v-menu>
  </v-btn>
</template>
