<script setup lang="ts">

</script>

<template>
  <v-card data-testid="data-card" :rounded="false" class="w-100 h-100">
    <template #default>
      <slot>
        <loading-component/>
      </slot>
    </template>
  </v-card>
</template>

<style scoped>

</style>
