import type { Iri } from '~~/types'

export const mediaObjectJoinInjectionKey = Symbol() as InjectionKey<
  ReturnType<typeof useMediaObjectJoin>
>

export function injectMediaObjectJoin() {
  const injected = inject(mediaObjectJoinInjectionKey)
  if ('undefined' === typeof injected) {
    throw new Error('Invalid injection request')
  }
  return injected
}
export const useMediaObjectJoin = (mediaObjectIri: Iri) => {
  const isCreateDialogOpen = ref(false)

  return {
    isCreateDialogOpen,
  }
}
