import type { Iri, PostCollectionPath } from '~~/types'

/**
 * Dedicated store driving the create/duplicate dialog for a given collection path.
 *
 * State semantics (tri-state):
 *  - `false` → dialog closed
 *  - `true`  → dialog open in blank-create mode
 *  - `Iri`   → dialog open in duplicate mode, sourced from this item's IRI
 *
 * Fetching the source item and shaping the cloned payload will be added in a
 * later step. This first step only introduces the state container, mirroring
 * the shape of `useResourceUpdateDialogStore` / `useResourceDeleteDialogStore`.
 */
export const useResourceCreateDialogStore = <P extends PostCollectionPath>(
  path: P,
) =>
  defineStore(`resource-dialog:create:${path}`, () => {
    const createDialogState = ref<boolean | Iri>(false)

    const isCreateDialogOpen = computed({
      get(): boolean {
        return Boolean(createDialogState.value)
      },
      set(value: boolean | Iri) {
        createDialogState.value = value
      },
    })

    const duplicateSource = computed<Iri | null>(() =>
      typeof createDialogState.value === 'boolean'
        ? null
        : createDialogState.value,
    )

    return {
      createDialogState,
      isCreateDialogOpen,
      duplicateSource,
    }
  })()

export default useResourceCreateDialogStore
