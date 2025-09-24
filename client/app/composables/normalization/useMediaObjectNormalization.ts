import { diff } from 'deep-object-diff'

const { createFromObject } = useTypedFormData('/api/data/media_objects')

export function useNormalization() {
  const onPreCreate = (item: any) => {
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
