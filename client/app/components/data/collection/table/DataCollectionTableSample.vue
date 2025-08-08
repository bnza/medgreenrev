<script
  setup
  lang="ts"
  generic="Path extends Extract<GetCollectionPath, '/api/data/samples'>"
>
import type { GetCollectionPath } from '~~/types'
import useResourceConfig from '~/stores/resource-config'

const props = defineProps<{
  path: Path
}>()

const { appPath } = useResourceConfig(props.path)
</script>

<template>
  <data-collection-table :path>
    <template #[`item.id`]="{ item }">
      <navigation-resource-item :id="item.id" :acl="item._acl" :app-path />
    </template>
    <!--
    <template #dialogs="{ refetch }">
      <data-dialog-create-sample :path @refresh="refetch()" />
      <data-dialog-delete-sample @refresh="refetch()" />
      <data-dialog-update-sample />
    </template>
    -->
  </data-collection-table>
</template>
