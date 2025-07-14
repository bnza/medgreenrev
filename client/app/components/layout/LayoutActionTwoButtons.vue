<script setup lang="ts">
defineSlots<{
  left(): any
  default(): any
}>()
</script>

<template>
  <v-container>
    <v-row justify="space-around">
      <v-col class="d-flex justify-center" cols="4">
        <slot name="left" />
      </v-col>
      <v-col class="d-flex justify-center" cols="4">
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>
