<script setup lang="ts">
import type {CollectionResponses} from "~~/types";

const resourceKey = "site"

// Define the specific operation path for sites as a const
const SITES_GET_COLLECTION_OPERATION = "/api/sites" as const satisfies keyof CollectionResponses
</script>

<template>
  <data-collection-table :operation="SITES_GET_COLLECTION_OPERATION">
    <template #[`item.id`]="{ item  }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path="getApiResourceConfig(resourceKey).appPath"
      />
    </template>
  </data-collection-table>
</template>
