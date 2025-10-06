import { diff } from 'deep-object-diff'

export function useNormalization() {
  const onPreCreate = (item: any) => {
    return item
  }

  const onPreUpdate =
    (oldItem: Record<string, any>) => (item: Record<string, any>) => {
      const diffItem = diff(oldItem, item)
      if (diffItem && 'taxonomies' in diffItem && 'taxonomies' in item) {
        diffItem.taxonomies = item.taxonomies
      }
      return diffItem
    }

  return {
    onPreCreate,
    onPreUpdate,
  }
}
