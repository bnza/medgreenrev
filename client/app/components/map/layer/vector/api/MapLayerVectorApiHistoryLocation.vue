<script setup lang="ts"></script>

<template>
  <map-layer-vector-api-base>
    <template #default="{ format }">
      <map-source-api-vector :format path="/api/features/history/locations" />
    </template>
  </map-layer-vector-api-base>
</template>
