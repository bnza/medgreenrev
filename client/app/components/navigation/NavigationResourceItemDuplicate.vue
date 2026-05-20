<script setup lang="ts" generic="Path extends GetCollectionPath">
import type { GetCollectionPath, Iri, PostCollectionPath } from '~~/types'
import { useResourceCreateDialogStore } from '~/stores/useResourceCreateDialogStore'

const props = withDefaults(
  defineProps<{
    path: Path
    item: { '@id': Iri }
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const { findApiResourcePath, isPostOperationPath } = useOpenApiStore()

const postPath = computed<PostCollectionPath | null>(() => {
  const candidate = findApiResourcePath(props.path)
  return isPostOperationPath(candidate) ? candidate : null
})

const _store = computed(() =>
  postPath.value
    ? storeToRefs(useResourceCreateDialogStore(postPath.value))
    : null,
)
const createDialogState = computed<boolean | Iri>({
  get: () => _store.value?.createDialogState.value ?? false,
  set: (v) => {
    if (_store.value) _store.value.createDialogState.value = v
  },
})

const disabledInternal = computed(() => props.disabled || !postPath.value)

const duplicate = () => {
  createDialogState.value = props.item['@id']
}

</script>

<template>
  <v-btn
    density="compact"
    :disabled="disabledInternal"
    icon
    variant="text"
    nuxt
    data-testid="duplicate-item-button"
    @click="duplicate"
  >
    <v-icon color="primary" icon="far fa-copy" size="xsmall" />
    <v-tooltip activator="parent" location="bottom">Duplicate item</v-tooltip>
  </v-btn>
</template>
