import { TypedFormData } from '~/api/TypedFormData'

export function useTypedFormData() {
  const createFromObject = <K extends Record<string, any>>(fields: K) => {
    const formData = new TypedFormData<K>()

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key as keyof K, value as K[keyof K])
      }
    })

    return formData
  }

  return {
    createFromObject,
  }
}
