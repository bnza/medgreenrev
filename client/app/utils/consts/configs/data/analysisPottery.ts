import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analyses/potteries',
  appPath: '/data/analysis/potteries',
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
      key: 'subject.inventory',
      value: 'subject.inventory',
      title: 'pottery',
      minWidth: '100',
    },
    {
      key: 'analysis.type.group',
      value: 'analysis.type.group',
      title: 'group',
      maxWidth: '200',
      minWidth: '200',
    },
    {
      key: 'analysis.type.value',
      value: 'analysis.type.value',
      title: 'type',
      maxWidth: '200',
      minWidth: '200',
    },
    {
      key: 'analysis.identifier',
      value: 'analysis.identifier',
      title: 'analysis',
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
  name: 'analysisPottery',
}

export default config
