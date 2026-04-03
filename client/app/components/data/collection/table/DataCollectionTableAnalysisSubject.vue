<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      '/api/data/analyses/{parentId}/subjects'
    >
  "
>
import type {
  ApiResourceKey,
  GetCollectionPath,
  ResourceParent,
} from '~~/types'
import { API_RESOURCE_MAP } from '~/utils/consts/resources'
import DataItemInfoBoxSpanDynamic from '~/components/data/item/info-box/span/DataItemInfoBoxSpanDynamic.vue'
import { RESOURCE_CONFIG_MAP } from '~/utils/consts/configs'

const props = defineProps<{
  path: Path
  parent: ResourceParent<'analysis'>
}>()

// const { appPath, labels } = useResourceConfig(props.path)
const { id: parentId } = useResourceParent(props.parent)
const getResourceKey = (key: string): ApiResourceKey | undefined => {
  return key in API_RESOURCE_MAP ? (key as ApiResourceKey) : undefined
}

const getResourceLabel = (key: string) => {
  if (!isApiResourceKey(key)) return key
  const path = API_RESOURCE_MAP[key]
  if (path in RESOURCE_CONFIG_MAP) {
    // @ts-expect-error some path are not in RESOURCE_CONFIG_MAP, but we just checked that they are
    return RESOURCE_CONFIG_MAP[path].labels[0]
  }
  return key
}
</script>

<template>
  <data-collection-table :path :parent-id>
    <template #[`item.id`]="{ item }">
      <navigation-dynamic-resource-item-read
        :id="item.id"
        :resource-key="getResourceKey(item.joinResourceName)"
        :disabled="!Boolean(getResourceKey(item.joinResourceName))"
      />
    </template>
    <template #[`item.resourceName`]="{ item }">
      <p>{{ getResourceLabel(item.resourceName) }}</p>
    </template>
    <template #[`item.subjectId`]="{ item }">
      <data-item-info-box-span-dynamic
        :id="item.subjectId"
        :resource-key="item.resourceName"
      />
    </template>
    <template #dialogs>
      <!--      <data-dialog-search :path :title="labels[1]" />-->
    </template>
  </data-collection-table>
</template>
