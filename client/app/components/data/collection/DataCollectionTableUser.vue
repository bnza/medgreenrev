<script setup lang="ts">
import type {GetCollectionPath} from "~~/types";

const resourceKey = "user"

const GET_COLLECTION_OPERATION = "/api/users" as const satisfies GetCollectionPath
</script>

<template>
  <data-collection-table :path="GET_COLLECTION_OPERATION">
    <template #[`item.id`]="{ item  }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path="getApiResourceConfig(resourceKey).appPath"
      />
    </template>
  </data-collection-table>
</template>
