<script setup lang="ts">
import type {CollectionResponses} from "~~/types";

// Define the specific operation path for sites as a const
const SITES_GET_COLLECTION_OPERATION = "/api/sites" as const satisfies keyof CollectionResponses

</script>

<template>
  <data-collection-table :operation="SITES_GET_COLLECTION_OPERATION">

  </data-collection-table>
</template>

<style scoped>

</style>
