import type { ApiResourcePath } from '../app/utils/consts/resources'

export type DataAutocompleteComponentProps = {
  path: ApiResourcePath
  itemTitle: string
  grantedOnly?: boolean
}
