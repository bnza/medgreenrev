import { createScopedUseRegle } from '@regle/core'

export const {
  useScopedRegle: useScopedRegleItem,
  useCollectScope: useCollectScopeRecord,
} = createScopedUseRegle({ asRecord: true })
