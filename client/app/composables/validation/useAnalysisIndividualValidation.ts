import { useAnalysisSubjectValidation } from '~/composables/validation/useAnalysisSubjectValidation'

const { useCreateValidation, useUpdateValidation } =
  useAnalysisSubjectValidation({
    validatorPath: '/api/validator/unique/analyses/individuals',
    subjectKey: 'individual',
  })

export { useCreateValidation, useUpdateValidation }
