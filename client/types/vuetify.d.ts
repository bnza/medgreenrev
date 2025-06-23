import {VSnackbar} from 'vuetify/components'

type SnackbarProps = InstanceType<typeof VSnackbar>['$props']

export type SnackbarMessage = {
  color: SnackbarProps['color']
  location?: SnackbarProps['location']
  multiline?: SnackbarProps['multiLine']
  text: string
  timeout?: SnackbarProps['timeout']
  vertical?: SnackbarProps['vertical']
  visible?: SnackbarProps['visible']
  title?: string
}
