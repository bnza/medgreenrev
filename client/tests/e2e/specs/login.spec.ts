import { test, expect } from '@playwright/test'
import { loadFixtures } from '~~/tests/e2e/utils/api'
import { LoginPage } from '~~/tests/e2e/pages/login.page'
import { HomePage } from '~~/tests/e2e/pages/home.page'
import { SiteCollectionPage } from '~~/tests/e2e/pages/site-collection.page'

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

test.describe('Auth handling', () => {
  test.use({ storageState: 'playwright/.auth/base.json' })
  test.skip('JWT expired token redirect to login', async ({ page }) => {
    await page.route(
      '**/api/data/sites**',
      async (route) => {
        // Mock JSON response
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ code: 401, message: 'Expired JWT Token' }),
        })
      },
      { times: 1 },
    )
    const pom = new LoginPage(page)
    const homePom = new HomePage(page)
    const siteCollectionPon = new SiteCollectionPage(page)
    await homePom.open()
    await homePom.clickAppDataNavigationDrawerItem(['Data', 'Sites'])
    const response = await page.waitForResponse('**/api/token/invalidate')
    //await pom.expectAppMessageToHaveText('Session expired. Please login again.')
    await expect(
      page.getByText('Session expired. Please login again.'),
    ).toBeVisible()
    expect(response.status()).toBe(200)
    //await expect(pom.appBar.loginButton).toBeVisible()
    await pom.login()
    await siteCollectionPon.dataCard.expectToHaveTitle(/sites/i)
  })
})
