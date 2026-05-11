import { computed, type WritableComputedRef } from 'vue'

interface WritableLike<T> {
  value: T
}

/**
 * Wraps a writable ref-like (Ref, ModelRef, WritableComputedRef, or any
 * `{ value }` accessor — including a Regle `r$.$value.someField` proxy when
 * passed via `toRef`/destructuring) so that every read and write is
 * Unicode-lowercased via `String.prototype.toLocaleLowerCase()`.
 *
 * Mirrors the API-side `mb_strtolower` normalization performed on
 * `Data\History\Animal::$animal` and `Data\History\Plant::$plant` setters,
 * so the UI displays exactly what the server will store.
 *
 * Usage in a component:
 *   const model = defineModel<string>({ default: '' })
 *   const lowerModel = useLowercaseModel(model)
 *   // bind `v-model="lowerModel"` on the input
 */
export function useLowercaseModel(
  model: WritableLike<string | undefined | null>,
) {
  return computed<string|null>({
    get: () => model.value ? model.value.toLocaleLowerCase() : null,
    set: (value: string|undefined|null) => {
      model.value = value ? value.toLocaleLowerCase() : null
    },
  })
}
