import type { OperationPathParams, FormDataFields } from '~~/types'
import { createRule, inferRules, type Maybe, useRegle } from '@regle/core'
import { required, withMessage } from '@regle/rules'
import { useGetPatchItemQuery } from '~/composables/queries/useGetPatchItemQuery'
import useMaxFileSizeValidationRule from '~/composables/validation/rules/useMaxFileSizeValidationRule'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'

type Item = FormDataFields<'/api/data/media_objects'>

const { maxFileSize } = useMaxFileSizeValidationRule()

const apiSha256Validator = new GetValidationOperation(
  '/api/validator/unique/media_objects/sha256',
)

const uniqueFile = createRule({
  validator: async (value: Maybe<File>) =>
    value
      ? await apiSha256Validator.isValid({
          sha256: await calculateSHA256FileHash(value),
        })
      : true,
  message: 'Duplicate file',
})

export function useCreateValidation() {
  const getEmptyModel = () =>
    ({
      type: undefined,
      description: undefined,
      file: undefined,
    }) as Partial<Item>

  const model = ref(getEmptyModel())

  const rules = computed(() =>
    inferRules(model, {
      file: {
        required: withMessage(required, 'File is required'),
        uniqueFile,
        maxFileSize,
      },
      type: {
        required,
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
    OperationPathParams<'/api/data/media_objects/{id}', 'get'> | undefined
  >,
) {
  const { item, responseItem, model } = useGetPatchItemQuery(
    '/api/data/media_objects/{id}',
    params,
  )

  const rules = computed(() =>
    inferRules(model, {
      type: {
        required,
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
