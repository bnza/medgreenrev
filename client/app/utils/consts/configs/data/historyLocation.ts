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
      key: 'name',
      value: 'name',
      title: 'name',
      minWidth: '200',
    },
    {
      key: 'point.x',
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
  name: 'historyLocation',
}

export default config
