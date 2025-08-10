import type { Page } from '@playwright/test'
import { DataDialogComponent } from '~~/tests/e2e/components/data-dialog.component'

export class DataDialogUpdateComponent extends DataDialogComponent {
  constructor(page: Page) {
    super(page, 'data-dialog-update')
  }
}
