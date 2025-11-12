import { useAnalysisSubjectValidation } from '~/composables/validation/useAnalysisSubjectValidation'

const { useCreateValidation, useUpdateValidation } =
  useAnalysisSubjectValidation({
    validatorPath: '/api/validator/unique/analyses/potteries',
    subjectKey: 'pottery',
  })

export { useCreateValidation, useUpdateValidation }
