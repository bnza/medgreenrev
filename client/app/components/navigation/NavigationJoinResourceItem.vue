<script setup lang="ts" generic="K extends string">
import type { ApiAclResource, Iri, JsonLdItem } from '~~/types'
import { extractIdFromIri, isJsonLdItem } from '~/utils'

const props = defineProps<{
  appPath: string
  item: Record<K, JsonLdItem> & ApiAclResource
  subResourceKey: K
}>()
defineEmits<{
  delete: []
}>()

const subResource = computed(() => props.item[props.subResourceKey])

const subResourceId = computed(() =>
  isJsonLdItem(subResource.value)
    ? extractIdFromIri(subResource.value['@id'] as Iri)
    : undefined,
)
</script>

<template>
  <v-btn-group>
    <navigation-resource-item-read
      v-if="subResourceId"
      :id="subResourceId"
      :app-path
      :disabled="!item._acl.canRead"
    />
    <navigation-resource-item-delete
      :disabled="!item._acl.canDelete"
      @delete="$emit('delete')"
    />
  </v-btn-group>
</template>
