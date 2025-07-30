<script setup lang="ts">
defineSlots<{
  'left-one'(): any
  'left-two'(): any
  default(): any
}>()
</script>

<template>
  <v-container>
    <v-row justify="space-around">
      <v-col class="d-flex justify-center" cols="2">
        <slot name="left-one" />
      </v-col>
      <v-col class="d-flex justify-center" cols="2">
        <slot name="left-two" />
      </v-col>
      <v-col class="d-flex justify-center" cols="3" />
      <v-col class="d-flex justify-center" cols="2">
        <slot />
      </v-col>
    </v-row>
  </v-container>
</template>
