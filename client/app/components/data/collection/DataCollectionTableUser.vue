<script setup lang="ts">
import type {CollectionResponses} from "~~/types";

const resourceKey = "user"

// Define the specific operation path for sites as a const
const GET_COLLECTION_OPERATION = "/api/users" as const satisfies keyof CollectionResponses
</script>

<template>
  <data-collection-table :operation="GET_COLLECTION_OPERATION">
    <template #[`item.id`]="{ item  }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path="getApiResourceConfig(resourceKey).appPath"
      />
    </template>
  </data-collection-table>
</template>
