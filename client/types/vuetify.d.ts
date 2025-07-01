import {VSnackbar} from 'vuetify/components'
import type {VDataTable} from 'vuetify/lib/components/VDataTable'

type SnackbarProps = InstanceType<typeof VSnackbar>['$props']
export type ReadonlyHeaders = InstanceType<typeof VDataTable>['$props']['headers']

export type SnackbarMessage = {
  color: SnackbarProps['color']
  location?: SnackbarProps['location']
  multiline?: SnackbarProps['multiLine']
  text: string
  timeout?: SnackbarProps['timeout']
  vertical?: SnackbarProps['vertical']
  visible?: SnackbarProps['visible']
  title?: string
  class?: string
}

export interface SortItem {
  key: string;
  order: 'asc' | 'desc';
}

export interface DataTableComponentOptions {
  page: number;
  itemsPerPage?: number;
  sortBy: SortItem[];
  groupBy: SortItem[];
  search?: string;
}


