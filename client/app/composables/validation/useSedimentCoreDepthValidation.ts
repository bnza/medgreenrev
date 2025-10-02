import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required, numeric } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

const uniqueSedimentCore = useApiUniqueValidator(
  '/api/validator/unique/sediment_core_depths',
  ['sedimentCore', 'depthMin'],
  'Duplicate [sediment core, depth (min)] combination',
)
const uniqueDepthMin = useApiUniqueValidator(
  '/api/validator/unique/sediment_core_depths',
  ['depthMin', 'sedimentCore'],
  'Duplicate [sediment core, depth (min)] combination',
)

export function useCreateValidation(
  parent?:
    | ResourceParent<'stratigraphicUnit', '/api/data/stratigraphic_units/{id}'>
    | ResourceParent<'sedimentCore', '/api/data/sediment_cores/{id}'>,
) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)
  type RequestBody = PostCollectionRequestMap['/api/data/sediment_core_depths']

  const getEmptyModel = () =>
    ({
      stratigraphicUnit:
        parentKey.value === 'stratigraphicUnit' ? parentIri.value : undefined,
      sedimentCore:
        parentKey.value === 'sedimentCore' ? parentIri.value : undefined,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      sedimentCore: {
        required,
        unique: uniqueSedimentCore(() => model.value.depthMin),
      },
      stratigraphicUnit: {
        required,
      },
      depthMin: {
        required,
        numeric,
        lessThan: lessThan('Min depth must be less than max depth.')(() =>
          Number(model.value.depthMax),
        ),
        unique: uniqueDepthMin(() => model.value.sedimentCore),
      },
      depthMax: {
        required,
        numeric,
        greaterThan: greaterThan('Max depth must be greater than min depth.')(
          () => Number(model.value.depthMin),
        ),
      },
    }),
  )
  const { r$ } = useRegle(model, rules)

  return {
    getEmptyModel,
    r$,
  }
}

export function useUpdateValidation(
  params: Ref<
    | OperationPathParams<'/api/data/sediment_core_depths/{id}', 'get'>
    | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/sediment_core_depths/{id}',
    params,
  )

  const sedimentCoreChanged = computed(
    () => item.value.sedimentCore !== model.value.sedimentCore,
  )

  const depthMinChanged = computed(
    () => item.value.depthMin !== model.value.depthMin,
  )

  const depthMaxChanged = computed(
    () => item.value.depthMax !== model.value.depthMax,
  )

  const rules = computed(() =>
    inferRules(model, {
      stratigraphicUnit: {
        required,
      },
      sedimentCore: {
        required,
        ...(sedimentCoreChanged.value
          ? {
              unique: uniqueSedimentCore(() => model.value.depthMin),
            }
          : {}),
      },
      depthMin: {
        required,
        numeric,
        ...(sedimentCoreChanged.value
          ? {
              unique: uniqueDepthMin(() => model.value.sedimentCore),
            }
          : {}),
        ...(depthMaxChanged.value
          ? {
              lessThan: lessThan('Min depth must be less than max depth.')(() =>
                Number(model.value.depthMax),
              ),
            }
          : {}),
      },
      depthMax: {
        required,
        numeric,
        ...(depthMinChanged.value
          ? {
              greaterThan: greaterThan(
                'Max depth must be greater than min depth.',
              )(() => Number(model.value.depthMin)),
            }
          : {}),
      },
    }),
  )

  const { r$ } = useRegle(model, rules)
  return {
    responseItem,
    item,
    r$,
  }
}
