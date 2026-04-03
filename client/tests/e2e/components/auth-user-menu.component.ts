import { BaseComponent } from '~~/tests/e2e/components/base.component'
import type { Page } from '@playwright/test'

export class AuthUserMenuComponent extends BaseComponent {
  public readonly logoutButton = this.container.getByRole('button', {
    name: 'Logout',
  })

  public readonly userSettingButton = this.container.getByTestId(
    'user-settings-me-link',
  )
  constructor(page: Page) {
    super(page, 'auth-user-menu')
  }
}
