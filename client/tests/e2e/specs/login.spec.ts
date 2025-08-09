import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { LoginPage } from '~~/tests/e2e/pages/login.page'
import { HomePage } from '~~/tests/e2e/pages/home.page'

test.beforeAll(async () => {
  loadFixtures()
})
test.describe('Login page', () => {
  test('Login redirection works as expected', async ({ page }) => {
    const homePom = new HomePage(page)
    const pom = new LoginPage(page)
    await homePom.open()
    await homePom.clickAppDataNavigationDrawerItem('About')
    await expect(homePom.page.getByTestId('app-layout')).toHaveText(
      /About page/,
    )
    await pom.appBar.loginButton.click()
    await pom.login()
    await expect(homePom.page.getByTestId('app-layout')).toHaveText(
      /About page/,
    )
  })
})
