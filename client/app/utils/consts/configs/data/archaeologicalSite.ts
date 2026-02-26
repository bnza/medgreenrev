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
      width: '200',
    },
    {
      key: 'name',
      value: 'name',
      title: 'name',
    },
    {
      key: 'chronologyLower',
      value: 'chronologyLower',
      title: 'chron.(lower)',
    },
    {
      key: 'chronologyUpper',
      value: 'chronologyUpper',
      title: 'chron.(upper)',
    },
    {
      key: 'description',
      value: 'description',
      title: 'description',
      sortable: false,
    },
  ],
  labels: ['archaeological site', 'archaeological sites'],
  name: 'archaeologicalSite',
}

export default config
