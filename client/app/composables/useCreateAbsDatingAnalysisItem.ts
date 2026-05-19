import type { AbsoluteDatingRequestItem } from '~~/types'
import { isEmptyObject } from '~/utils'

/**
 * Builds a writable computed `item` over a composed regle scope created with
 * `useCollectScopeRecord<{ base, absDating }>()`, used by analysis-create
 * wrappers that join a base resource with an optional absolute-dating
 * sub-form.
 *
 * - `get`: returns `base` with `absDatingAnalysis` populated from `absDating`
 *   when non-empty, otherwise `null`. Mirrors the inline computed previously
 *   inlined in every concerned `DataDialogCreate<Resource>.vue` wrapper.
 * - `set`: splits an incoming payload (e.g. emitted by `@clone`) back into
 *   the two regle sub-forms, so the duplicate flow re-populates both pieces.
 */
export const useCreateAbsDatingAnalysisItem = <Base extends Record<string, any>>(
  r$: {
    $value: {
      base: Base
      absDating: AbsoluteDatingRequestItem
    }
  },
) => {
  type Composed = Base & {
    absDatingAnalysis: AbsoluteDatingRequestItem | null
  }
  const item = computed<Partial<Composed>>({
    get: () => {
      const base = (r$.$value.base ?? ({} as Base)) as Composed
      base.absDatingAnalysis = isEmptyObject(r$.$value.absDating)
        ? null
        : r$.$value.absDating
      return base
    },
    set: (payload) => {
      const { absDatingAnalysis, ...rest } = (payload ?? {}) as Partial<Composed>
      r$.$value.base = rest as unknown as Base
      r$.$value.absDating = (absDatingAnalysis ?? {}) as AbsoluteDatingRequestItem
    },
  })
  return { item }
}

export default useCreateAbsDatingAnalysisItem
