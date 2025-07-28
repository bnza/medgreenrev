<script setup lang="ts" generic="Path extends ValidationMethodToPath<'create'>">
import type { PostCollectionRequestMap, ValidationMethodToPath } from '~~/types'
import { createRule, inferRules, type Maybe, useRegle } from '@regle/core'
import { maxValue, minValue, required, integer } from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'

defineProps<{
  path: Path
  parentId?: string
}>()

type RequestBody = PostCollectionRequestMap['/api/sites']
const getEmptyModel = () => ({}) as RequestBody
const model = ref(getEmptyModel())

const apiCodeValidator = new GetValidationOperation(
  '/api/validator/unique/sites/code/{id}',
)

const apiNameValidator = new GetValidationOperation(
  '/api/validator/unique/sites/name/{id}',
)

const uniqueCode = createRule({
  validator: async (value: Maybe<string>) => {
    return typeof value === 'string'
      ? await apiCodeValidator.isValid({ id: value })
      : true
  },
  message: 'Code must be unique',
})

const uniqueName = createRule({
  validator: async (value: Maybe<string>) => {
    return typeof value === 'string'
      ? await apiNameValidator.isValid({ id: value })
      : true
  },
  message: 'Name must be unique',
})

const greaterThanOrEqual = createRule({
  validator: (
    value: Maybe<number | string>,
    otherValue: Maybe<number | string>,
  ) => {
    const valueNumber = Number(value)
    const otherValueNumber = Number(otherValue)
    return Number.isFinite(valueNumber) && Number.isFinite(otherValueNumber)
      ? valueNumber >= otherValueNumber
      : true
  },
  message: 'Lower chronology must be greater than or equal upper chronology.',
})

const lessThanOrEqual = createRule({
  validator: (
    value: Maybe<number | string>,
    otherValue: Maybe<number | string>,
  ) => {
    const valueNumber = Number(value)
    const otherValueNumber = Number(otherValue)
    return Number.isFinite(valueNumber) && Number.isFinite(otherValueNumber)
      ? valueNumber <= otherValueNumber
      : true
  },
  message: 'Upper chronology must be less than or equal lower chronology.',
})

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
      lessThanOrEqual: lessThanOrEqual(() => model.value.chronologyUpper),
    },
    chronologyUpper: {
      integer,
      minValue: minValue(-32768),
      maxValue: maxValue(new Date().getFullYear()),
      greaterOrEqualThan: greaterThanOrEqual(() => model.value.chronologyLower),
    },
  }),
)

const { r$ } = useRegle(model, rules)

const onPreSubmit = (item: any) => {
  if ('chronologyLower' in item)
    item.chronologyLower = Number(item.chronologyLower)
  if ('chronologyUpper' in item)
    item.chronologyUpper = Number(item.chronologyUpper)
  return item
}
</script>

<template>
  <data-dialog-create
    v-model:regle="r$"
    :path
    title="Site"
    :parent="undefined"
    :on-pre-submit
    :get-empty-model
  >
    <template #default>
      <data-item-form-edit-site
        v-if="r$.$value"
        v-model:item="r$.$value"
        mode="create"
        :errors="r$.$errors"
      />
    </template>
  </data-dialog-create>
</template>
