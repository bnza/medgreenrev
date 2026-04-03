import { BaseItemPage } from '~~/tests/e2e/pages/base-item.page'
import type { Page } from '@playwright/test'
import { UserPasswordDialogComponent } from '~~/tests/e2e/components/user-password-dialog.component'

export class SettingsMePage extends BaseItemPage {
  protected readonly path = '/settings/me'
  public readonly userPasswordDialog = new UserPasswordDialogComponent(
    this.page,
  )
  constructor(page: Page) {
    super(page, 'data-toolbar-item-user-me-action-menu')
  }
}
