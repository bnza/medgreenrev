import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/analyses/sample_botany_taxonomies',
  appPath: '/data/analyses/sample/botany',
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
      key: 'taxonomy',
      value: 'taxonomy',
      title: 'taxonomy',
      minWidth: '200',
    },
    {
      key: 'cf',
      value: 'cf',
      title: 'cf',
      maxWidth: '100',
      minWidth: '100',
    },
    {
      key: 'sp',
      value: 'sp',
      title: 'sp',
      maxWidth: '100',
      minWidth: '100',
    },
    {
      key: 'type',
      value: 'type',
      title: 'type',
      maxWidth: '100',
      minWidth: '100',
    },
  ],
  labels: ['sample botany taxonomy', 'sample botany taxonomies'],
  name: 'analysisSampleBotanyTaxonomy',
}

export default config
