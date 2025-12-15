<script setup lang="ts">
defineSlots<{
  default(): any
}>()
</script>

<template>
  <v-btn data-testid="map-list-menu-base" icon>
    <v-icon size="xsmall" icon="fas fa-gear" />
    <v-tooltip activator="parent" location="bottom">Settings</v-tooltip>
    <v-menu
      activator="parent"
      data-testid="map-list-menu-base-menu"
      :close-on-content-click="false"
    >
      <v-card width="400">
        <v-card-title>Settings</v-card-title>
        <v-card-text>
          <slot />
        </v-card-text>
      </v-card>
    </v-menu>
  </v-btn>
</template>
