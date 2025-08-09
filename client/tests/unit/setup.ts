// tests/setup.ts
import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Create vuetify instance for testing
const vuetify = createVuetify({
  components,
  directives,
})

// Configure global test settings
config.global.plugins = [vuetify]
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
