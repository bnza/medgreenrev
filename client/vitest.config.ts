import {defineVitestConfig} from '@nuxt/test-utils/config'
import {resolve} from 'path'

export default defineVitestConfig({
  // plugins: [
  //   vue(),
  // ],
  test: {
    alias: {
      '~': resolve(__dirname, './app'),
    },
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
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
    setupFiles: ['./tests/setup.ts'],
  }
})
