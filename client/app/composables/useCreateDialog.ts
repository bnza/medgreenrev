import type {
  ApiResourcePath,
  OperationPathParams,
  PostCollectionPath,
  PostCollectionRequestMap,
} from '~~/types'
import useGetItemQuery from '~/composables/queries/useGetItemQuery'
import { useResourceCreateDialogStore } from '~/stores/useResourceCreateDialogStore'
import { usePostCloneDuplicateNormalization } from '~/composables/usePostCloneDuplicateNormalization'
import useResourceUiStore from '~/stores/useResourceUiStore'
import { API_ITEMS_RESOURCE_MAP } from '~/utils/consts/resources'
import { extractIdFromIri } from '~/utils'

/**
 * Drives the create/duplicate dialog for a given resource.
 *
 * The caller passes a single `path` that must be both an API resource path
 * (a value of `API_RESOURCE_MAP`) and a POST collection path. From that
 * single anchor we derive everything else:
 *  - The corresponding GET item path is looked up in `API_ITEMS_RESOURCE_MAP`,
 *    giving us a strict `ApiItemPath` (subtype of `GetItemPath`) without any
 *    string template cast.
 *  - The duplicate dialog store and the resource UI store are keyed by `path`.
 *  - The normalizer is parametrised by `path`, so `clonedItem` is typed as
 *    `Partial<PostCollectionRequestMap[Path]>`.
 *
 * Mirrors the shape of `useUpdateDialog`.
 */
export const useCreateDialog = <
  Path extends PostCollectionPath & ApiResourcePath,
>(
  path: Path,
) => {

  const getItemPath = API_ITEMS_RESOURCE_MAP[path]

  // Dialog state (tri-state: false | true | Iri).
  const { createDialogState, isCreateDialogOpen, duplicateSource } = storeToRefs(
    useResourceCreateDialogStore(path),
  )

  // Post-success redirect flag (shared with the rest of the resource UI).
  const { redirectToItem } = storeToRefs(useResourceUiStore(path))

  // GET item query, parameterised by the duplicate source IRI.
  const getItemParams = computed<
    OperationPathParams<typeof getItemPath, 'get'> | undefined
  >(() =>
    duplicateSource.value
      ? ({ id: extractIdFromIri(duplicateSource.value) } as OperationPathParams<
          typeof getItemPath,
          'get'
        >)
      : undefined,
  )

  const isDuplicate = computed(() => typeof createDialogState.value !== 'boolean')
  


  const {
    data: fetchedItem,
    status: cloneStatus,
    error: cloneError,
  } = useGetItemQuery(getItemPath, getItemParams)

  const isReady = computed(() => !isDuplicate.value || cloneStatus.value === 'success')

  // Strip identity/audit/JSON-LD fields and apply any per-resource override.
  const normalize = usePostCloneDuplicateNormalization<Path>(path)

  const clonedItem = computed<Partial<PostCollectionRequestMap[Path]> | null>(
    () => {
      if (!duplicateSource.value) return null
      const value = fetchedItem.value
      if (!value) return null
      return normalize(value as unknown as Record<string, any>)
    },
  )

  return {
    createDialogState,
    isDuplicate,
    isCreateDialogOpen,
    isReady,
    duplicateSource,
    clonedItem,
    cloneStatus,
    cloneError,
    redirectToItem,
    getItemPath,
  }
}

export default useCreateDialog
