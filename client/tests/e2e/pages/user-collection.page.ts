import { BaseCollectionPage } from '~~/tests/e2e/pages/base-collection.page'
import { UserPasswordDialogComponent } from '~~/tests/e2e/components/user-password-dialog.component'

export class UserCollectionPage extends BaseCollectionPage {
  protected readonly path = '/admin/users'
  public readonly apiUrl = '/api/admin/users'

  public readonly userPasswordDialog = new UserPasswordDialogComponent(
    this.page,
  )
}
