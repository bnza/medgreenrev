import { createRule, type Maybe } from '@regle/core'

export const useMaxFileSizeValidationRule = () => {
  const configClientMaxBodySize = useRuntimeConfig().public.clientMaxBodySize
  const maxBodySize = parseBitSize(configClientMaxBodySize)

  const maxFileSizeFn = createRule({
    type: 'maxFileSize',
    validator: (value: Maybe<File>, maxSize: number) => {
      if (!value) return true
      return value.size <= maxSize
    },
    message: (context) =>
      `File size must not exceed ${configClientMaxBodySize}: ${formatBitSize(context.$value?.size)} given`,
  })

  const maxFileSize = maxFileSizeFn(maxBodySize)

  return {
    maxFileSize,
    maxBodySize,
  }
}

export default useMaxFileSizeValidationRule
