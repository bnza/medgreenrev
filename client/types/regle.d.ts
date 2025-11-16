import type { RegleRoot } from '@regle/core'

type RegleReset<T extends Record<string, unknown>> = Pick<
  RegleRoot<T>,
  '$reset'
>['$reset']

export type RegleAdapter<T extends Record<string, unknown>> = {
  $reset: RegleReset<T>
  $validate: () => Promise<{ valid: boolean; [key: string]: any }>
}
