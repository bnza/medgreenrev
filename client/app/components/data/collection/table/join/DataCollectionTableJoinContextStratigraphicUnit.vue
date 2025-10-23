<script
  setup
  lang="ts"
  generic="
    Path extends Extract<
      GetCollectionPath,
      | '/api/data/context_stratigraphic_units'
      | '/api/data/stratigraphic_units/{parentId}/contexts'
      | '/api/data/contexts/{parentId}/stratigraphic_units'
    >
  "
>
import type { GetCollectionPath, ResourceParent } from '~~/types'

const props = defineProps<{
  path: Path
  parent?: ResourceParent<'stratigraphicUnit'> | ResourceParent<'context'>
}>()

const subResourceKey = computed(() =>
  props.parent?.key === 'stratigraphicUnit' ? 'context' : 'stratigraphicUnit',
)

const { appPath } = useResourceConfig(
  props.parent
    ? props.parent.key === 'stratigraphicUnit'
      ? '/api/data/contexts'
      : '/api/data/stratigraphic_units'
    : props.path,
)
const { deleteDialogState } = storeToRefs(
  useResourceDeleteDialogStore('/api/data/context_stratigraphic_units/{id}'),
)
const { id: parentId } = useResourceParent(props.parent)
</script>

<template>
  <data-collection-table :path :parent-id>
    <template #[`item.id`]="{ item }">
      <navigation-join-resource-item
        :item
        :sub-resource-key
        :app-path
        @delete="deleteDialogState = { id: item.id }"
      />
    </template>
    <template #[`item.context.site.code`]="{ item }">
      <data-item-info-box-span-site
        :iri="item.context.site['@id']"
        :text="item.context.site.code"
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
    <template #dialogs="{ refetch }">
      <data-dialog-download :path :title="subResourceKey" :parent-id />
      <data-dialog-create-context-stratigraphic-unit
        :path
        :parent
        @refresh="refetch()"
      />
      <data-dialog-delete-context-stratigraphic-unit @refresh="refetch()" />
    </template>
  </data-collection-table>
</template>
