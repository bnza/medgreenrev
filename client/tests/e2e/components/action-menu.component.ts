import { BaseComponent } from '~~/tests/e2e/components/base.component'

export class AuthUserMenuComponent extends BaseComponent {
  public readonly logoutButton = this.container.getByRole('button', {
    name: 'Logout',
  })
}
