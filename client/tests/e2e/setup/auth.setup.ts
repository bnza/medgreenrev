import { test as setup, expect } from '@playwright/test'
import { LoginPage } from '~~/tests/e2e/pages/login.page'
import { loadFixtures, credentials } from '~~/tests/e2e/utils/api'

setup.beforeAll(() => {
  loadFixtures()
})

const adminFile = 'playwright/.auth/admin.json'

setup('authenticate as admin user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.ADMIN)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: adminFile })
})

const editorFile = 'playwright/.auth/editor.json'
setup('authenticate as editor user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.EDITOR)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: editorFile })
})

const baseFile = 'playwright/.auth/base.json'
setup('authenticate as base user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.BASE)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: baseFile })
})

const geoFile = 'playwright/.auth/geo.json'
setup('authenticate as geo archaeologist user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.GEO)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: geoFile })
})

const botFile = 'playwright/.auth/bot.json'
setup(
  'authenticate as archaeobotanist archaeologist user',
  async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.open()
    await loginPage.login(credentials.BOT)
    await expect(page.getByTestId('app-message').first()).toHaveText(
      /successfully logged in/,
    )
    await page.context().storageState({ path: botFile })
  },
)

const hisFile = 'playwright/.auth/his.json'
setup('authenticate as historian user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.HIS)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: hisFile })
})

const matFile = 'playwright/.auth/mat.json'
setup('authenticate as material analyst user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.MAT)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: matFile })
})

const mstFile = 'playwright/.auth/mst.json'
setup('authenticate as microstratigraphist user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.MST)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: mstFile })
})

const antFile = 'playwright/.auth/ant.json'
setup('authenticate as anthropologist user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.ANT)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: antFile })
})

const potFile = 'playwright/.auth/pot.json'
setup('authenticate as ceramic specialist user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.POT)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: potFile })
})

const zooFile = 'playwright/.auth/zoo.json'
setup('authenticate as zooarchaeologist user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.ZOO)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: zooFile })
})

const cliFile = 'playwright/.auth/cli.json'
setup('authenticate as paleoclimatologist user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.open()
  await loginPage.login(credentials.CLI)
  await expect(page.getByTestId('app-message').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: cliFile })
})
