<script
  setup
  lang="ts"
  generic="P extends Extract<GetCollectionPath, '/api/data/samples'>"
>
import type { GetCollectionPath } from '~~/types'

defineProps<{
  path: P
}>()

const { isAuthenticated } = useAppAuth()
</script>

<template>
  <data-collection-page
    title="Samples"
    :parent="false"
    :path
    :show-back-button="false"
    :acl="{
      canExport: isAuthenticated,
      canCreate: false,
    }"
  >
    <data-collection-table-sample :path />
  </data-collection-page>
</template>
