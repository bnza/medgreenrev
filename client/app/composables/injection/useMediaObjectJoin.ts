import type { Iri, PostCollectionResponseMap } from '~~/types'

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
export const useMediaObjectJoin = (itemIri: Ref<Iri | undefined>) => {
  const isCreateDialogOpen = ref(false)
  const creatingMediaObject =
    ref<PostCollectionResponseMap['/api/data/media_objects']>()

  const uploadingFile = ref<File | undefined>()
  const isNewMediaObject = computed(
    () => !creatingMediaObject.value && Boolean(uploadingFile.value),
  )

  const uploadFileValidationPending = ref(false)

  const creatingMediaObjectJoin = ref({
    mediaObject: creatingMediaObject.value?.['@id'],
    item: itemIri.value,
  })

  watch(
    () => creatingMediaObject.value,
    (value) => {
      console.log(
        'useMediaObjectJoin creatingMediaObject.value changed: ',
        value,
      )
      creatingMediaObjectJoin.value.mediaObject = value?.['@id']
    },
  )

  const deletingMediaObjectJoinItem = ref<Iri | undefined>()

  return {
    creatingMediaObject,
    creatingMediaObjectJoin,
    isCreateDialogOpen,
    isNewMediaObject,
    deletingMediaObjectJoinItem,
    uploadingFile,
    uploadFileValidationPending,
  }
}
