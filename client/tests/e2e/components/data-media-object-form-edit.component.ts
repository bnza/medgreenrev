import { type Page, expect } from '@playwright/test'
import { DataDialogComponent } from '~~/tests/e2e/components/data-dialog.component'

export class DataMediaObjectFormEditComponent extends DataDialogComponent {
  public readonly fileUploadItem = this.container.getByTestId(
    'data-dialog-form-file-uploading',
  )
  constructor(page: Page) {
    super(page, 'data-dialog-form')
  }

  expectFileUploadItemToHaveText(text: string | RegExp) {
    // extract filename from path and use it as regex
    if ('string' === typeof text) {
      const chunks = text.split('/')
      text = new RegExp(`^${chunks.pop()}`)
    }
    return expect(this.fileUploadItem).toHaveText(text)
  }
}
