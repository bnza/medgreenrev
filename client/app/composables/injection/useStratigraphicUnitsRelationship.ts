import type {
  ApiAclResource,
  GetCollectionMemberResponseMap,
  GetItemResponseMap,
  Iri,
  StratigraphicUnitRelationshipKey,
} from '~~/types'
import type { AsyncDataRequestStatus } from '#app'

export const stratigraphicUnitsRelationshipInjectionKey =
  Symbol() as InjectionKey<ReturnType<typeof useStratigraphicUnitsRelationship>>

export function injectStratigraphicUnitsRelationship() {
  const injected = inject(stratigraphicUnitsRelationshipInjectionKey)
  if ('undefined' === typeof injected) {
    throw new Error('Invalid injection request')
  }
  return injected
}

export const useStratigraphicUnitsRelationship = (
  lftSu: GetItemResponseMap['/api/data/stratigraphic_units/{id}'] &
    ApiAclResource,
) => {
  const isReadonly = ref(true)
  const canUpdate = computed(() => lftSu._acl.canUpdate)
  const isEditable = computed(() => !isReadonly.value && canUpdate.value)

  const parentId = computed(() => ({
    parentId: extractIdFromIri(lftSu['@id']),
  }))
  const {
    items: _items,
    totalItems,
    refetch,
  } = useGetCollectionQuery(
    '/api/data/stratigraphic_units/{parentId}/relationships',
    parentId,
  )

  // @TODO temporary workaround, fix useGetCollectionQuery items type
  const items = computed(
    () =>
      _items.value as GetCollectionMemberResponseMap['/api/data/stratigraphic_units/{parentId}/relationships'][],
  )

  const submitStatus = ref<AsyncDataRequestStatus>('idle')

  const creatingRelationshipType = ref<StratigraphicUnitRelationshipKey>()
  const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl
  const creatingRelationshipIri = computed(() =>
    creatingRelationshipType.value
      ? `${apiBaseUrl}/api/vocabulary/stratigraphic_unit/relationships/${creatingRelationshipType.value}`
      : undefined,
  )
  const creatingRelationshipText = computed(() =>
    creatingRelationshipType.value
      ? STRATIGRAPHIC_UNIT_RELATIONSHIP_MAP[creatingRelationshipType.value]
      : undefined,
  )

  const deletingRelationshipIri = ref<Iri>()
  const deletingParams = computed(() =>
    deletingRelationshipIri.value
      ? { id: extractIdFromIri(deletingRelationshipIri.value) }
      : undefined,
  )
  const isDeleteDialogOpen = computed(
    () => isEditable.value && Boolean(deletingRelationshipIri.value),
  )

  const lftStratigraphicUnit = computed(() => lftSu)

  return {
    canUpdate,
    creatingRelationshipIri,
    creatingRelationshipText,
    creatingRelationshipType,
    deletingRelationshipIri,
    deletingParams,
    lftStratigraphicUnit,
    submitStatus,
    totalItems,
    isReadonly,
    isEditable,
    isDeleteDialogOpen,
    parentId,
    refetch,
    items,
  }
}

export default useStratigraphicUnitsRelationship
