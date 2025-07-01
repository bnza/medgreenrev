<script setup lang="ts">
definePageMeta({
  auth: false,
})

const route = useRoute()
</script>

<template>
  <lazy-data-card title="Site">
    {{ route.params.id }}
  </lazy-data-card>
</template>

<style scoped>

</style>
