import { useAnalysisSubjectValidation } from '~/composables/validation/useAnalysisSubjectValidation'

const { useCreateValidation, useUpdateValidation } =
  useAnalysisSubjectValidation({
    validatorPath: '/api/validator/unique/analyses/botany/charcoals',
    subjectKey: 'botanyCharcoal',
  })

export { useCreateValidation, useUpdateValidation }
