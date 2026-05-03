<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/sediment_core_depth_botany_taxonomies'
      | '/api/data/analyses/sediment_core_depths/botany/{parentId}/taxonomies'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'
defineProps<{
  path: P
  parent?: ResourceParent<'analysisSedimentCoreDepthBotany'>
}>()
const { isAuthenticated } = useAppAuth()
const acl = ref({ canExport: isAuthenticated, canCreate: false })
</script>
<template>
  <data-collection-page
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl
  >
    <data-collection-table-analysis-sediment-core-depth-botany-taxonomy
      v-model:acl="acl"
      :path
      :parent
    />
  </data-collection-page>
</template>
