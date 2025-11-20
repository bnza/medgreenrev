import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/history/locations',
  appPath: '/data/history/locations',
  defaultHeaders: [
    {
      key: 'id',
      value: 'id',
      title: 'ID',
      align: 'center',
      width: '200',
      maxWidth: '200',
    },
    {
      key: 'value',
      value: 'value',
      title: 'value',
      minWidth: '200',
    },
    {
      key: 'point.y',
      value: 'n',
      title: 'N',
      minWidth: '100',
      sortable: false,
    },
    {
      key: 'point.x',
      value: 'e',
      title: 'E',
      minWidth: '100',
      sortable: false,
    },
  ],
  labels: ['location (historical data)', 'locations (historical data)'],
  name: 'vocHistoryLocation',
}

export default config
