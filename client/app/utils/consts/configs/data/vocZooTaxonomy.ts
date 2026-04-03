import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/vocabulary/zoo/taxonomies',
  appPath: '/data/vocabulary/zoo/taxonomies',
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
      key: 'value',
      value: 'value',
      title: 'value',
      minWidth: '100',
    },
    {
      key: 'vernacularName',
      value: 'vernacularName',
      title: 'vernacular name',
      minWidth: '200',
    },
    {
      key: 'class',
      value: 'class',
      title: 'class',
      minWidth: '150',
    },
    {
      key: 'family',
      value: 'family',
      title: 'family',
      minWidth: '150',
    },
  ],
  labels: ['taxonomy (animal)', 'taxonomies (animal)'],
  name: 'vocZooTaxonomy',
}

export default config
