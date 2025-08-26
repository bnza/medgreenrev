<script
  setup
  lang="ts"
  generic="
    P extends Extract<
      GetCollectionPath,
      '/api/data/analyses/potteries' | '/api/data/potteries/{parentId}/analyses'
    >
  "
>
import type { GetCollectionPath, Iri, ResourceParent } from '~~/types'
import { ApiSpecialistRole } from '~/utils/consts/auth'

const props = defineProps<{
  path: P
  parent?: ResourceParent<'pottery', '/api/data/potteries/{id}'>
}>()

const {
  hasAnySitePrivilege,
  hasSitePrivilege,
  isAuthenticated,
  hasSpecialistRole,
} = useAppAuth()
const hasPrivileges = computed(() => {
  if (props.parent) {
    return props.parent.item.stratigraphicUnit?.site?.['@id']
      ? hasSitePrivilege.value(
          Number(
            extractIdFromIri(
              props.parent.item.stratigraphicUnit.site['@id'] as Iri,
            ),
          ),
        )
      : false
  }
  return hasAnySitePrivilege.value
})

const canCreate = computed(
  () =>
    hasPrivileges.value &&
    hasSpecialistRole(ApiSpecialistRole.CeramicSpecialist).value,
)
</script>
<template>
  <data-collection-page
    title="Pottery Analyses"
    :parent="Boolean(parent)"
    :path
    :show-back-button="!Boolean(parent)"
    :acl="{
      canExport: isAuthenticated,
      canCreate,
    }"
  >
    <data-collection-table-pottery-analysis :path :parent />
  </data-collection-page>
</template>
