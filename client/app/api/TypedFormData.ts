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

  hasField<K extends keyof T>(name: K): boolean {
    return this._fields.has(name)
  }

  getTyped<K extends keyof T>(name: K): T[K] | null {
    return super.get(name as string) as T[K] | null
  }

  override delete<K extends keyof T>(name: K): void {
    this._fields.delete(name)
    super.delete(name as string)
  }

  // Get all tracked field names
  getTrackedFields(): (keyof T)[] {
    return Array.from(this._fields)
  }

  // Check if all required fields are present
  hasRequiredFields(requiredFields: (keyof T)[]): boolean {
    return requiredFields.every((field) => this._fields.has(field))
  }
}
