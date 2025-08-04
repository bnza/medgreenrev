import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import type { OperationPathParams, PostCollectionRequestMap } from '~~/types'
import { createRule, inferRules, type Maybe, useRegle } from '@regle/core'
import { applyIf, integer, maxValue, minValue, required } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'

const apiCodeValidator = new GetValidationOperation(
  '/api/validator/unique/sites/code/{id}',
)

const apiNameValidator = new GetValidationOperation(
  '/api/validator/unique/sites/name/{id}',
)

const uniqueCode = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiCodeValidator.isValid({ id: value }) : true,
  message: 'Code must be unique',
})

const uniqueName = createRule({
  validator: async (value: Maybe<string>) =>
    value ? await apiNameValidator.isValid({ id: value }) : true,
  message: 'Name must be unique',
})

export function useCreateValidation() {
  type RequestBody = PostCollectionRequestMap['/api/data/sites']
  const getEmptyModel = () => ({}) as RequestBody
  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      code: {
        required,
        unique: uniqueCode,
      },
      name: {
        required,
        unique: uniqueName,
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
  params: Ref<OperationPathParams<'/api/data/sites/{id}', 'get'> | undefined>,
) {
  const { item, model, responseItem } = useGetPatchItemQuery(
    '/api/data/sites/{id}',
    params,
  )

  const codeChanged = computed(() => item.value.code !== model.value.code)

  const nameChanged = computed(() => item.value.name !== model.value.name)

  const rules = computed(() =>
    inferRules(model, {
      code: {
        required: applyIf(codeChanged, required),
        unique: asyncConditionalRule(codeChanged, uniqueCode),
      },
      name: {
        required: applyIf(nameChanged, required),
        unique: asyncConditionalRule(nameChanged, uniqueName),
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
