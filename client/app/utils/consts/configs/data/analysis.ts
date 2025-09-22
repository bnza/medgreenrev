import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analyses',
  appPath: '/data/analyses',
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
      key: 'status',
      value: 'status',
      title: 'status',
      minWidth: '100',
    },
    {
      key: 'identifier',
      value: 'identifier',
      title: 'identifier',
      minWidth: '100',
    },
    {
      key: 'type.value',
      value: 'type.value',
      title: 'type',
      minWidth: '150',
    },
    {
      key: 'responsible',
      value: 'responsible',
      title: 'responsible',
      maxWidth: '200',
      minWidth: '200',
    },
    {
      key: 'summary',
      value: 'summary',
      title: 'summary',
      minWidth: '300',
      sortable: false,
    },
  ],
  labels: ['pottery analysis', 'pottery analyses'],
  name: 'potteryAnalysis',
}

export default config
