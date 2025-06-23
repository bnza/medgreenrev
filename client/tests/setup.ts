// tests/setup.ts
import {vi} from 'vitest'
import {config} from '@vue/test-utils'

// You may not need all these mocks with @nuxt/test-utils
// but keep them if needed for specific tests

// Global test utilities
config.global.stubs = {
  'nuxt-link': true,
  'router-link': true,
  'v-btn': true, // Vuetify components
  'v-card': true,
  'v-layout': true,
}
