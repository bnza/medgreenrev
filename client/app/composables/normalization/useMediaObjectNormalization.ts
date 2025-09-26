import { diff } from 'deep-object-diff'

const { createFromObject } = useTypedFormData()

export function useNormalization() {
  const onPreCreate = (item: Record<string, any>) => {
    return createFromObject(item)
  }

  const onPreUpdate =
    (oldItem: Record<string, any>) => (item: Record<string, any>) => {
      return diff(oldItem, item)
    }

  return {
    onPreCreate,
    onPreUpdate,
  }
}
