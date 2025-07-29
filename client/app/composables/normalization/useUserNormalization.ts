import { diff } from 'deep-object-diff'

export function useNormalization() {
  const onPreCreate = (item: any) => {
    item.plainPassword = generatePassword()
    return item
  }

  const onPreUpdate =
    (oldItem: Record<string, any>) => (item: Record<string, any>) => {
      const diffItem = diff(oldItem, item)
      if (diffItem && 'roles' in diffItem && 'roles' in item) {
        diffItem.roles = item.roles
      }
      return diffItem
    }

  return {
    onPreCreate,
    onPreUpdate,
  }
}
