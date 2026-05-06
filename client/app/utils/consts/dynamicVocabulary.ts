import type { DynamicVocabularyPath } from '~~/types'

// Runtime list of dynamic vocabulary paths. Must stay in sync with the
// `DynamicVocabularyPath` type union defined in `types/openapi-helpers.d.ts`.
export const DYNAMIC_VOCABULARY_PATHS = [
  '/api/vocabulary/zoo/taxonomies',
  '/api/vocabulary/botany/taxonomies',
  '/api/vocabulary/history/locations',
  '/api/vocabulary/history/authors',
] as const satisfies readonly DynamicVocabularyPath[]

export const isDynamicVocabularyPath = (
  path: string | undefined | null,
): path is DynamicVocabularyPath =>
  !!path && (DYNAMIC_VOCABULARY_PATHS as readonly string[]).includes(path)
