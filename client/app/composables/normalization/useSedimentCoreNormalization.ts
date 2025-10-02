import { diff } from 'deep-object-diff'

export function useNormalization() {
  const onPreCreate = (item: any) => {
    if ('number' in item) item.number = Number(item.number)
    if ('year' in item) item.year = Number(item.year)
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
