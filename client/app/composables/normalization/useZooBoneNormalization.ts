import { diff } from 'deep-object-diff'

export function useNormalization() {
  const onPreCreate = (item: any) => {
    if ('endsPreserved' in item) item.endsPreserved = Number(item.endsPreserved)
    return item
  }

  const onPreUpdate =
    (oldItem: Record<string, any>) => (item: Record<string, any>) => {
      return onPreCreate(diff(oldItem, item))
    }

  return {
    onPreCreate,
    onPreUpdate,
  }
}
