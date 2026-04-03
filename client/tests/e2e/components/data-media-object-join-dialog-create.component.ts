import { type Page, expect } from '@playwright/test'
import { DataDialogComponent } from '~~/tests/e2e/components/data-dialog.component'
import { getFixturePath } from '~~/tests/e2e/utils'
import { DataMediaObjectFormEditComponent } from '~~/tests/e2e/components/data-media-object-form-edit.component'

export class DataMediaObjectJoinDialogCreateComponent extends DataDialogComponent {
  public readonly fileInput = this.container.locator('input[type="file"]')
  public readonly editForm = new DataMediaObjectFormEditComponent(this.page)
  constructor(page: Page) {
    super(page, 'data-dialog-media-object-join-create')
  }

  async setFileInput(file: string) {
    await this.fileInput.setInputFiles(getFixturePath(file))
    await this.editForm.expectFileUploadItemToHaveText(file)
  }

  expectFileAlreadyArchived() {
    return expect(this.container).toContainText(/Media already archived/)
  }
}
