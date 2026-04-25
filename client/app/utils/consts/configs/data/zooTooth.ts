import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/zoo/teeth',
  appPath: '/data/zoo/teeth',
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
      key: 'stratigraphicUnit.codeView.code',
      value: 'stratigraphicUnit.code',
      title: 'SU',
      minWidth: '100',
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
      key: 'connected',
      value: 'connected',
      title: 'connected',
      minWidth: '100',
    },
    {
      key: 'side.code',
      value: 'side.code',
      title: 'side',
      minWidth: '100',
    },
    {
      key: 'notes',
      value: 'notes',
      title: 'notes',
      minWidth: '300',
      sortable: false,
    },
  ],
  labels: ['animal tooth', 'animal teeth'],
  name: 'zooTooth',
}

export default config
