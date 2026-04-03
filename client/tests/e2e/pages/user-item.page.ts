import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'
import { UserPasswordDialogComponent } from '~~/tests/e2e/components/user-password-dialog.component'

export class UserItemPage extends BaseItemPage {
  protected readonly path = '/data/users/[id]'

  constructor(page: Page) {
    super(page, 'item-action-menu')
  }

  public readonly userPasswordDialog = new UserPasswordDialogComponent(
    this.page,
  )
}
