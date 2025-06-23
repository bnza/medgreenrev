import {defineVitestConfig} from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // You can also use 'jsdom' or 'happy-dom' for lighter tests
    environmentOptions: {
      nuxt: {
        rootDir: './',
        domEnvironment: 'jsdom', // or 'happy-dom'
      }
    },
    include: [
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'app/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      '**/node_modules/**',
      '**/cypress/**',
      '**/playwright/**',
    ],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
    },
    setupFiles: ['./tests/setup.ts']
  }
})
