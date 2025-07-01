<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
  <v-card data-testid="data-card" :rounded="false" class="w-100 h-100">
    <template #default>
      <data-card-toolbar :title/>
      <slot>
        <loading-component/>
      </slot>
    </template>
  </v-card>
</template>
