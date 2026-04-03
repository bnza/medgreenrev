import type { SnackbarMessage } from '~~/types'

const DEFAULT_MESSAGE = {
  color: 'info',
  timeout: 3000,
  visible: true,
  class: 'app-message-item',
} as const satisfies Partial<SnackbarMessage>

export const useMessagesStore = defineStore('messages', () => {
  const queue = ref<SnackbarMessage[]>([])

  function add(message: SnackbarMessage) {
    queue.value.push({ ...DEFAULT_MESSAGE, ...message })
  }

  function addSuccess(text: string) {
    add({ color: 'success', text })
  }

  function addError(text: unknown, title?: string) {
    // Check if it's a FetchError with 422 status
    if (isFetchError(text) && text.status === 422) {
      if (isHydraConstraintViolation(text.data)) {
        // Handle constraint violations
        text.data.violations?.forEach(
          (violation: { propertyPath?: string; message?: string }) => {
            const violationTitle = violation.propertyPath
              ? `${title || 'Validation Error'}: ${violation.propertyPath}`
              : title || 'Validation Error'
            add({
              color: 'error',
              timeout: -1,
              text: violation.message || 'Unknown validation error',
              title: violationTitle,
            })
          },
        )
        return
      }
    }

    if (text instanceof Error) {
      text = text.message
    }
    if (typeof text !== 'string') {
      throw new Error(`Unsupported fetch response: ${typeof text}`)
    }
    add({ color: 'error', timeout: -1, text, title })
  }

  return { queue, add, addSuccess, addError }
})
