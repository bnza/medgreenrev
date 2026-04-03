import type { PiniaColadaOptions } from '@pinia/colada'
import { PiniaColadaRetry } from '@pinia/colada-plugin-retry'

export default {
  plugins: [
    PiniaColadaRetry({
      retry: (failureCount: number, error: unknown) => {
        const e = error as
          | { status?: number; data?: { message?: string } }
          | undefined
        if (e?.status === 401 && e?.data?.message === 'Expired JWT Token') {
          console.log('retry')
          return failureCount < 2
        }
        return false
      },
    }),
  ],
} satisfies PiniaColadaOptions
