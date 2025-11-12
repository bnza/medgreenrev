import { useAnalysisSubjectValidation } from '~/composables/validation/useAnalysisSubjectValidation'

const { useCreateValidation, useUpdateValidation } =
  useAnalysisSubjectValidation({
    validatorPath: '/api/validator/unique/analyses/zoo/bones',
    subjectKey: 'zooBone',
  })

export { useCreateValidation, useUpdateValidation }
