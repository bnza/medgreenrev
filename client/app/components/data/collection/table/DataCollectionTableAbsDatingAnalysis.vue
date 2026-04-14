<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/analyses/absolute_dating'
      | '/api/data/analyses/{parentId}/absolute_dating'
    >
  "
>
import type {
  ApiResourceKey,
  CollectionAcl,
  GetCollectionPath,
  ResourceParent,
} from '~~/types'
import { capitalize } from 'vue'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'analysis'>
}>()

const { labels } = useResourceConfig(props.path)

const { id: parentId } = useResourceParent(props.parent)

const getResourceKey = (string: string): ApiResourceKey | undefined => {
  const key = `analysis${capitalize(string)}`
  return key in API_RESOURCE_MAP ? (key as ApiResourceKey) : undefined
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

const acl = defineModel<CollectionAcl>('acl', { required: true })
</script>

<template>
  <data-collection-table :path :parent-id @acl="acl = { ...acl, ...$event }">
    <template #[`item.id`]="{ item }">
      <navigation-dynamic-resource-item-read
        :id="item.id"
        :resource-key="getResourceKey(item.subjectType)"
      />
    </template>
    <template #[`item.analysis.identifier`]="{ item }">
      <data-item-info-box-span-analysis
        :iri="item.analysis['@id']"
        :text="item.analysis.identifier"
      />
    </template>
    <template #[`item.stratigraphicUnit.site.code`]="{ item }">
      <data-item-info-box-span-archaeological-site
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
    <template #dialogs>
      <data-dialog-download :path :title="labels[1]" />
      <data-dialog-search :path :title="labels[1]" />
    </template>
  </data-collection-table>
</template>
