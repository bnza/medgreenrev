import { expect } from '@playwright/test'
import { BaseComponent } from '~~/tests/e2e/components/base.component'
import { DataMediaObjectJoinDialogCreateComponent } from '~~/tests/e2e/components/data-media-object-join-dialog-create.component'

export class DataMediaObjectJoinContainerComponent extends BaseComponent {
  public readonly createButton = this.container.getByTestId(
    'create-media-button',
  )

  public readonly cards = this.container.getByTestId('media-object-join-card')

  public readonly dataDialogCreate =
    new DataMediaObjectJoinDialogCreateComponent(this.page)

  public readonly dataDialogDelete = this.page.getByTestId(
    'delete-media-object-card',
  )

  openCreateDialog() {
    return this.createButton.click()
  }

  expectMediaObjectCardsToHaveCount(count: number) {
    return expect(this.cards).toHaveCount(count)
  }
}
