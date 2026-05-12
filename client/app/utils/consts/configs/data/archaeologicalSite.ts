import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/archaeological_sites',
  appPath: '/data/sites/archaeology',
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
      key: 'code',
      value: 'code',
      title: 'code',
      minWidth: '100',
    },
    {
      key: 'name',
      value: 'name',
      title: 'name',
      minWidth: '200',
    },
    {
      key: 'region.value',
      value: 'region.value',
      title: 'region',
      minWidth: '200',
    },
    {
      key: 'chronologyLower',
      value: 'chronologyLower',
      title: 'chron.(lower)',
      minWidth: '100',
    },
    {
      key: 'chronologyUpper',
      value: 'chronologyUpper',
      title: 'chron.(upper)',
      minWidth: '100',
    },
    {
      key: 'description',
      value: 'description',
      title: 'description',
      minWidth: '300',
      sortable: false,
    },
  ],
  labels: ['archaeological site', 'archaeological sites'],
  name: 'archaeologicalSite',
}

export default config
