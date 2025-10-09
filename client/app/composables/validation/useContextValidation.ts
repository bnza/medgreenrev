import type {
  OperationPathParams,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'
import { inferRules, useRegle } from '@regle/core'
import { required } from '@regle/rules'
import useResourceParent from '~/composables/useResourceParent'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

const uniqueSite = useApiUniqueValidator(
  '/api/validator/unique/contexts',
  ['site', 'name'],
  'Duplicate [number, site, year] combination',
)
const uniqueName = useApiUniqueValidator(
  '/api/validator/unique/contexts',
  ['name', 'site'],
  'Duplicate [number, site, year] combination',
)
export function useCreateValidation(parent?: ResourceParent<'site'>) {
  const { key: parentKey, iri: parentIri } = useResourceParent(parent)

  type RequestBody = PostCollectionRequestMap['/api/data/contexts']
  const getEmptyModel = () =>
    ({
      site: parentKey.value === 'site' ? parentIri.value : undefined,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      type: { required },
      site: { required, uniqueYear: uniqueSite(() => model.value.name) },
      name: { required, uniqueName: uniqueName(() => model.value.site) },
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
    OperationPathParams<'/api/data/contexts/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/contexts/{id}',
    params,
  )

  const siteChanged = computed(() => item.value.site !== model.value.site)
  const nameChanged = computed(() => item.value.name !== model.value.name)

  const rules = computed(() => {
    const baseRules = {
      type: { required },
      site: {
        required,
        // Conditionally add uniqueSite validation only when site has changed
        // Using spread operator to dynamically include async validators and avoid applyIf issues
        ...(siteChanged.value
          ? {
              uniqueSite: uniqueSite(() => model.value.name),
            }
          : {}),
      },
      name: {
        required,
        // Conditionally add uniqueName validation only when name has changed
        // Using spread operator to dynamically build validation rules
        ...(nameChanged.value
          ? {
              uniqueName: uniqueName(() => model.value.site),
            }
          : {}),
      },
    }

    return inferRules(model, baseRules)
  })

  const { r$ } = useRegle(model, rules)

  return {
    responseItem,
    item,
    r$,
  }
}
