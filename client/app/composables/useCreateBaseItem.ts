/**
 * Builds a writable computed `item` over a single-record regle scope created
 * with `useCollectScope<[T]>()`.
 *
 * - `get`: returns `r$.$value[0]` (same as the inline `computed(() => r$.$value[0])`
 *   previously inlined in every `DataDialogCreate<Resource>.vue` wrapper).
 * - `set`: writes the payload back into `r$.$value[0]`, enabling the duplicate
 *   flow (`@clone` event from `DataDialogCreate`) to repopulate the form.
 *
 * Keeping a writable computed (rather than two refs) preserves reactive parity
 * with the regle scope so validation continues to track the same source value.
 */
export const useCreateBaseItem = <T extends Record<string, any>>(
  r$: { $value: [T] } | { $value: T[] },
) => {
  const item = computed<Partial<T>>({
    get: () => (r$.$value as T[])[0] || {} as Partial<T>,
    set: (payload) => {
      ;(r$.$value as T[])[0] = { ...((payload ?? {}) as Partial<T>) } as T
    },
  })
  return { item }
}

export default useCreateBaseItem
