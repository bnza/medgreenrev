import { diff } from 'deep-object-diff'

export function useNormalization() {
  const onPreCreate = (item: any) => {
    return item
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
