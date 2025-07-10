<script setup lang="ts">
import type {GetCollectionPath} from "~~/types";

const resourceKey = "site"

const SITES_GET_COLLECTION_OPERATION = "/api/sites" as const satisfies GetCollectionPath
const appPath = getApiResourceConfig(resourceKey).appPath
</script>

<template>
  <data-collection-table :path="SITES_GET_COLLECTION_OPERATION">
    <template #[`item.id`]="{ item  }">
      <navigation-resource-item
        :id="item.id"
        :acl="item._acl"
        :app-path
      />
    </template>
  </data-collection-table>
</template>
