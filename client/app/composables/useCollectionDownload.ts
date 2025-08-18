import useCollectionQueryStore from '~/stores/collection-query'
import type { GetCollectionPath, OperationPathParams } from '~~/types'
import { GetCollectionOperation } from '~/api/operations/GetCollectionOperation'

export const downloadCsv = (resourceName: string, data: string) => {
  const fileURL = window.URL.createObjectURL(
    new Blob([data], { type: 'text/csv' }),
  )
  const fileLink = document.createElement('a')
  fileLink.href = fileURL
  fileLink.setAttribute('download', `export-${resourceName}.csv`)
  document.body.appendChild(fileLink)
  fileLink.click()
  fileLink.remove()
  window.URL.revokeObjectURL(fileURL) // Free up memory
}

export const useCollectionDownload = (
  resourceName: string,
  path: GetCollectionPath,
  params: Ref<OperationPathParams<typeof path, 'get'> | undefined>,
) => {
  const { addError, addSuccess } = useMessagesStore()
  const { totalItems, queryObject } = storeToRefs(useCollectionQueryStore(path))

  const status = ref<'idle' | 'pending' | 'success' | 'error'>('idle')

  const getCollectionOperation = new GetCollectionOperation(path)

  const downloadAndFeedback = async () => {
    status.value = 'pending'
    try {
      const csvData = await getCollectionOperation.requestCsv({
        query: { ...queryObject.value },
        params: params?.value,
      })

      downloadCsv(resourceName, csvData)

      status.value = 'success'
      addSuccess('Resource successfully downloaded.')
    } catch (e) {
      addError(e)
      status.value = 'error'
    }
  }

  return {
    downloadAndFeedback,
    status,
    totalItems,
  }
}
