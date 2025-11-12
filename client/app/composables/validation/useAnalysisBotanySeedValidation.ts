import { useAnalysisSubjectValidation } from '~/composables/validation/useAnalysisSubjectValidation'

const { useCreateValidation, useUpdateValidation } =
  useAnalysisSubjectValidation({
    validatorPath: '/api/validator/unique/analyses/botany/seeds',
    subjectKey: 'botanySeed',
  })

export { useCreateValidation, useUpdateValidation }
