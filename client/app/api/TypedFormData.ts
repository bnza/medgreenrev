export class TypedFormData<T extends Record<string, any>> extends FormData {
  private _fields = new Set<keyof T>()

  override append<K extends keyof T>(name: K, value: T[K]): void {
    this._fields.add(name)
    super.append(name as string, value as any)
  }

  override set<K extends keyof T>(name: K, value: T[K]): void {
    this._fields.add(name)
    super.set(name as string, value as any)
  }

  toObject(): Partial<T> {
    const obj: Partial<T> = {}
    this._fields.forEach((field) => {
      const value = this.getTyped(field)
      if (value !== null) {
        obj[field] = value
      }
    })
    return obj
  }

  getTyped<K extends keyof T>(name: K): T[K] | null {
    return super.get(name as string) as T[K] | null
  }

  override delete<K extends keyof T>(name: K): void {
    this._fields.delete(name)
    super.delete(name as string)
  }
}
