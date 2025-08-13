import type { PostCollectionPath, FormDataFields } from '~~/types'
import { TypedFormData } from '~/api/TypedFormData'

export function useTypedFormData<K extends PostCollectionPath>(path: K) {
  type Fields = FormDataFields<K>

  const createFormData = () => new TypedFormData<Fields>()

  const createFromObject = (fields: Partial<Fields>) => {
    const formData = new TypedFormData<Fields>()

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key as keyof Fields, value as Fields[keyof Fields])
      }
    })

    return formData
  }

  return {
    createFormData,
    createFromObject,
  }
}
