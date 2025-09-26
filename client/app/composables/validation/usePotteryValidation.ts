import type {
  PostCollectionRequestMap,
  OperationPathParams,
  ResourceParent,
} from '~~/types'
import { createRule, inferRules, type Maybe, useRegle } from '@regle/core'
import { required, integer, minValue, maxValue } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import useResourceParent from '~/composables/useResourceParent'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

const apiInventoryValidator = new GetValidationOperation(
  '/api/validator/unique/potteries/inventory',
)

const uniqueInventory = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiInventoryValidator.isValid({ inventory: value }) : true,
  message: 'Inventory must be unique',
})

export function useCreateValidation(
  parent?: ResourceParent<
    'stratigraphicUnit',
    '/api/data/stratigraphic_units/{id}'
  >,
) {
  type RequestBody = PostCollectionRequestMap['/api/data/potteries']

  const { key: parentKey, iri: parentIri } = useResourceParent(parent)
  const getEmptyModel = () =>
    ({
      stratigraphicUnit:
        parentKey.value === 'stratigraphicUnit' ? parentIri.value : undefined,
    }) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      stratigraphicUnit: {
        required,
      },
      inventory: {
        required,
        unique: uniqueInventory,
      },
      functionalGroup: {
        required,
      },
      functionalForm: {
        required,
      },
      chronologyLower: {
        integer,
        minValue: minValue(-32768),
        maxValue: maxValue(new Date().getFullYear()),
        lessThanOrEqual: lessThanOrEqual(
          'Lower chronology must be greater than or equal upper chronology.',
        )(() => model.value.chronologyUpper),
      },
      chronologyUpper: {
        integer,
        minValue: minValue(-32768),
        maxValue: maxValue(new Date().getFullYear()),
        greaterOrEqualThan: greaterThanOrEqual(
          'Upper chronology must be less than or equal lower chronology.',
        )(() => model.value.chronologyLower),
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
    OperationPathParams<'/api/data/potteries/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/potteries/{id}',
    params,
  )

  const inventoryChanged = computed(
    () => item.value.inventory !== model.value.inventory,
  )

  const rules = computed(() =>
    inferRules(model, {
      stratigraphicUnit: {
        required,
      },
      inventory: {
        required,
        ...(inventoryChanged.value
          ? {
              unique: uniqueInventory,
            }
          : {}),
      },
      functionalGroup: {
        required,
      },
      functionalForm: {
        required,
      },
      chronologyLower: {
        integer,
        minValue: minValue(-32768),
        maxValue: maxValue(new Date().getFullYear()),
        lessThanOrEqual: lessThanOrEqual(
          'Lower chronology must be greater than or equal upper chronology.',
        )(() => model.value.chronologyUpper),
      },
      chronologyUpper: {
        integer,
        minValue: minValue(-32768),
        maxValue: maxValue(new Date().getFullYear()),
        greaterOrEqualThan: greaterThanOrEqual(
          'Upper chronology must be less than or equal lower chronology.',
        )(() => model.value.chronologyLower),
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
