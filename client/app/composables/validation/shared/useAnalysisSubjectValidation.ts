import type { GetValidationPath } from '~~/types'
import { required } from '@regle/rules'

export type AnalysisSubjectValidationPath = {
  [K in GetValidationPath]: K extends `/api/validator/unique/${string}`
    ? K
    : never
}[GetValidationPath]

const useAnalysisSubjectValidation = (path: AnalysisSubjectValidationPath) => {
  const uniqueSubject = useApiUniqueValidator(
    path,
    ['subject', 'analysis'],
    'Duplicate [subject, analysis] combination',
  )
  const uniqueAnalysis = useApiUniqueValidator(
    path,
    ['analysis', 'subject'],
    'Duplicate [subject, analysis] combination',
  )

  return (model: Ref<{ analysis?: string; subject?: string }>) => ({
    subject: {
      required,
      unique: uniqueSubject(() => model.value.analysis),
    },
    analysis: {
      required,
      unique: uniqueAnalysis(() => model.value.subject),
    },
  })
}

export default useAnalysisSubjectValidation
