import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/botany/charcoals',
  appPath: '/data/botany/charcoals',
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
      key: 'stratigraphicUnit.site.code',
      value: 'stratigraphicUnit.site.code',
      title: 'site',
      minWidth: '100',
    },
    {
      key: 'stratigraphicUnit.code',
      value: 'stratigraphicUnit.code',
      title: 'SU',
      minWidth: '100',
      sortable: false,
    },
    {
      key: 'taxonomy.vernacularName',
      value: 'taxonomy',
      title: 'vernacular name',
      minWidth: '200',
    },
    {
      key: 'taxonomy.class',
      value: 'taxonomy',
      title: 'class',
      minWidth: '150',
    },
    {
      key: 'taxonomy.family',
      value: 'taxonomy',
      title: 'family',
      minWidth: '150',
    },
    {
      key: 'taxonomy.value',
      value: 'taxonomy',
      title: 'taxonomy',
      minWidth: '200',
    },
    {
      key: 'element.value',
      value: 'element',
      title: 'element',
      minWidth: '150',
    },
    {
      key: 'part.value',
      value: 'part',
      title: 'part',
      minWidth: '150',
    },
    {
      key: 'notes',
      value: 'notes',
      title: 'notes',
      minWidth: '300',
      sortable: false,
    },
  ],
  labels: ['charcoal (archaeobotany)', 'charcoals (archaeobotany)'],
  name: 'botanyCharcoal',
}

export default config
