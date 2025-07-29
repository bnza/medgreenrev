export function useNormalization() {
  const onPreCreate = (item: any) => {
    if ('privilege' in item) item.privilege = Number(item.privilege)
    return item
  }

  const onPreUpdate =
    (_oldItem: Record<string, any>) =>
    <T extends Record<string, any>>(item: T) => {
      const submitItem = {} as Partial<T>
      // Only privilege can be updated
      if ('privilege' in item) {
        submitItem['privilege' as keyof T] = Number(
          !item.privilege,
        ) as T[keyof T]
      }
      return submitItem
    }

  return {
    onPreCreate,
    onPreUpdate,
  }
}
