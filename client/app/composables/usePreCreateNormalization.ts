import type { ApiResourceKey } from '~/utils/consts/resources'

const { createFromObject } = useTypedFormData()

const NORMALIZATION_FN_MAP: Partial<
  Record<ApiResourceKey, (item: Record<string, any>) => any>
> = {
  mediaObject: (item: Record<string, any>) => {
    return createFromObject(item)
  },
  user: (item: Record<string, any>) => {
    item.plainPassword = generatePassword()
    return item
  },
}

export const usePreCreateNormalization = (resourceKey: ApiResourceKey) => {
  return (
    NORMALIZATION_FN_MAP[resourceKey] ?? ((item: Record<string, any>) => item)
  )
}

export default usePreCreateNormalization
