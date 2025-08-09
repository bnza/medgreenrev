import { BaseComponent } from '~~/tests/e2e/components/base.component'
import type { Page } from '@playwright/test'
import { AuthUserMenuComponent } from '~~/tests/e2e/components/auth-user-menu.component'

export class AppBarComponent extends BaseComponent {
  public readonly authUserButton = this.page.getByTestId('auth-user-button')
  public readonly appBarNavIcon = this.page.getByTestId('app-bar-nav-icon')
  public readonly loginButton = this.page.getByTestId('login-button')
  public readonly authUserMenu = new AuthUserMenuComponent(this.page)
  constructor(page: Page) {
    super(page, 'app-bar')
  }

  async clickOnUserSettingsButton() {
    await this.authUserButton.click()
    await this.authUserMenu.userSettingButton.click()
  }
}
