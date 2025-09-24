import { defineConfig, devices } from '@playwright/test'
import { config } from 'dotenv'

// Load test environment variables globally for all tests
config({ path: '.env.test' })

export default defineConfig({
  testDir: './tests/e2e/specs',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',

  use: {
    baseURL: 'http://localhost:3000/app',
    trace: 'on-first-retry',
    viewport: { width: 1600, height: 1000 },
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/, testDir: './tests/e2e/setup' },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' }, // or 'msedge-dev'
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
