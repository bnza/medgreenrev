import type { RegleErrorTree } from '@regle/core'

const flattenRegleErrors = (
  errors: RegleErrorTree<any, any> | undefined,
): string[] | undefined => {
  if (!errors) return undefined

  const result: string[] = []

  function recurse(errorNode: any) {
    if (typeof errorNode === 'string') {
      result.push(errorNode)
    } else if (Array.isArray(errorNode)) {
      errorNode.forEach((e) => recurse(e))
    } else if (typeof errorNode === 'object' && errorNode !== null) {
      for (const key in errorNode) {
        recurse(errorNode[key])
      }
    }
  }

  recurse(errors)

  return result.length > 0 ? result : undefined
}

export { flattenRegleErrors }
