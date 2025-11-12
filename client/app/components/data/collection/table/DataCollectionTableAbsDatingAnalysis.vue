<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      '/api/data/analyses/absolute_dating'
    >
  "
>
import type {
  ApiResourceKey,
  GetCollectionPath,
  ResourceParent,
} from '~~/types'
import { capitalizeString } from '~/utils'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'
import { RESOURCE_CONFIG_MAP } from '~/utils/consts/configs'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'analysis'>
}>()

const { id: parentId } = useResourceParent(props.parent)

const getResourceKey = (string: string): ApiResourceKey | undefined => {
  const key = `analysis${capitalizeString(string)}`
  return key in API_RESOURCE_MAP ? (key as ApiResourceKey) : undefined
}

const getResourceLabel = (resourceKey: string) => {
  if (isApiResourceKey(resourceKey)) {
    const resourcePath = API_RESOURCE_MAP[resourceKey]
    if (resourcePath in RESOURCE_CONFIG_MAP) {
      // @ts-expect-error some resourcePath are not in RESOURCE_CONFIG_MAP, but we just checked that they are
      return RESOURCE_CONFIG_MAP[resourcePath].labels[0]
    }
    return resourceKey
  }
  return resourceKey
}

const getStatusText = (status: number | null | undefined) => {
  switch (status) {
    case 0:
      return 'requested'
    case 1:
      return 'pending'
    case 2:
      return 'completed'
    default:
      return 'unknown'
  }
}
</script>

<template>
  <data-collection-table :path :parent-id>
    <template #[`item.id`]="{ item }">
      <navigation-dynamic-resource-item-read
        :id="item.id"
        :resource-key="getResourceKey(item.subjectType)"
      />
    </template>
    <template #[`item.subjectType`]="{ item }">
      {{ getResourceLabel(item.subjectType) }}
    </template>
    <template #[`item.analysis.identifier`]="{ item }">
      <data-item-info-box-span-analysis
        :iri="item.analysis['@id']"
        :text="item.analysis.identifier"
      />
    </template>
    <template #[`item.stratigraphicUnit.site.code`]="{ item }">
      <data-item-info-box-span-site
        :iri="item.stratigraphicUnit.site['@id']"
        :text="item.stratigraphicUnit.site.code"
      />
    </template>
    <template #[`item.stratigraphicUnit.code`]="{ item }">
      <data-item-info-box-span-stratigraphic-unit
        :iri="item.stratigraphicUnit['@id']"
        :text="item.stratigraphicUnit.code"
      />
    </template>
    <template #[`item.analysis.status`]="{ item }">
      {{ getStatusText(item.analysis.status) }}
    </template>
    <!--    <template #dialogs="{ refetch }">-->
    <!--      &lt;!&ndash;      <data-dialog-download :path title="Context" />&ndash;&gt;-->
    <!--      <data-dialog-search :path title="Analysis" />-->
    <!--      <data-dialog-create-analysis :path :parent @refresh="refetch()" />-->
    <!--      <data-dialog-delete-analysis @refresh="refetch()" />-->
    <!--      <data-dialog-update-analysis @refresh="refetch()" />-->
    <!--    </template>-->
  </data-collection-table>
</template>
