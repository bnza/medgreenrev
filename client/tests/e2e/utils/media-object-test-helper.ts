import { expect, type Page } from '@playwright/test'
import { resetFixtureMedia } from '~~/tests/e2e/utils/api'
import type { DataMediaObjectJoinContainerComponent } from '~~/tests/e2e/components/data-media-object-join-container'

interface ItemPageWithMedia {
  mediaContainer: DataMediaObjectJoinContainerComponent
}

/**
 * Reusable e2e test for the media object lifecycle (create new, create existing,
 * create image with thumbnail retry, delete).
 *
 * @param page - Playwright Page instance
 * @param itemPom - An item page object that exposes a `mediaContainer` property
 * @param navigateToMediaTab - Async callback that navigates to the target item
 *   and opens the media tab. Called after fixture media is reset.
 */
export async function testMediaObjectLifecycle(
  page: Page,
  itemPom: ItemPageWithMedia,
  navigateToMediaTab: () => Promise<void>,
) {
  resetFixtureMedia()
  await navigateToMediaTab()
  await itemPom.mediaContainer.expectMediaObjectCardsToHaveCount(0)

  // CREATE (new media)
  await itemPom.mediaContainer.openCreateDialog()
  await itemPom.mediaContainer.dataDialogCreate.expectDialogToBeVisible()
  await itemPom.mediaContainer.dataDialogCreate.setFileInput(
    'input/lorem ipsum.txt',
  )
  await itemPom.mediaContainer.dataDialogCreate.form.getByLabel('type').click()
  await page.getByRole('listbox').getByText('report', { exact: true }).click()
  await itemPom.mediaContainer.dataDialogCreate.form
    .getByLabel('description')
    .fill('A short description of the media object')
  await itemPom.mediaContainer.dataDialogCreate.submitForm()
  await itemPom.mediaContainer.expectMediaObjectCardsToHaveCount(1)

  // CREATE (existing media)
  await itemPom.mediaContainer.openCreateDialog()
  await itemPom.mediaContainer.dataDialogCreate.expectDialogToBeVisible()
  await itemPom.mediaContainer.dataDialogCreate.setFileInput(
    'input/unnecessary stuff.csv',
  )
  await itemPom.mediaContainer.dataDialogCreate.expectFileAlreadyArchived()
  await itemPom.mediaContainer.dataDialogCreate.submitForm()
  await itemPom.mediaContainer.expectMediaObjectCardsToHaveCount(2)

  // CREATE (image media)
  await page.route(
    '**/media/**/*.thumb.jpeg',
    (route) => route.fulfill({ status: 404 }),
    { times: 1 },
  )
  await itemPom.mediaContainer.openCreateDialog()
  await itemPom.mediaContainer.dataDialogCreate.expectDialogToBeVisible()
  await itemPom.mediaContainer.dataDialogCreate.setFileInput(
    'input/logo-big-recortado.png',
  )
  await itemPom.mediaContainer.dataDialogCreate.form.getByLabel('type').click()
  await page.getByRole('listbox').getByText('drawing', { exact: true }).click()
  await itemPom.mediaContainer.dataDialogCreate.form
    .getByLabel('description')
    .fill('An image media object')
  const thumbResponsePromise = page.waitForResponse(
    (response) =>
      response.url().includes('.thumb.jpeg') &&
      response.url().includes('_retry') &&
      response.status() === 200,
  )
  await itemPom.mediaContainer.dataDialogCreate.submitForm()
  await itemPom.mediaContainer.expectMediaObjectCardsToHaveCount(3)
  const thumbResponse = await thumbResponsePromise
  expect(thumbResponse.status()).toBe(200)

  // DELETE
  await itemPom.mediaContainer.cards
    .first()
    .getByTestId('delete-media-button')
    .click()
  await itemPom.mediaContainer.dataDialogDelete
    .getByRole('button', { name: /delete/i })
    .click()
  await itemPom.mediaContainer.expectMediaObjectCardsToHaveCount(2)
}
