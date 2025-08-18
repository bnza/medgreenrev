import type { GetCollectionPath, OperationPathParams } from '~~/types'

export const useResourceDownloadDialogStore = <P extends GetCollectionPath>(
  path: P,
) =>
  defineStore(`resource-dialog:download:${path}`, () => {
    const visible = ref(false)

    const params = ref<OperationPathParams<P, 'get'>>()

    return {
      params,
      visible,
    }
  })()
