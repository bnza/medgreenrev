import { diff } from 'deep-object-diff'

export function useNormalization() {
  const onPreCreate = (item: any) => {
    if ('chronologyLower' in item)
      item.chronologyLower = Number(item.chronologyLower)
    if ('chronologyUpper' in item)
      item.chronologyUpper = Number(item.chronologyUpper)
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
