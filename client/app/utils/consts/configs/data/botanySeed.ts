import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/botany/seeds',
  appPath: '/data/botany/seeds',
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
      key: 'flat.value',
      value: 'flat.value',
      title: 'taxonomy',
      minWidth: '200',
    },
    {
      key: 'taxonomy.flat.class',
      value: 'taxonomy.flat.class',
      title: 'class',
      minWidth: '150',
    },
    {
      key: 'taxonomy.flat.family',
      value: 'taxonomy.flat.family',
      title: 'family',
      minWidth: '150',
    },
    {
      key: 'taxonomy.flat.genus',
      value: 'taxonomy.flat.genus',
      title: 'genus',
      minWidth: '150',
    },
    {
      key: 'taxonomy.flat.species',
      value: 'taxonomy.flat.species',
      title: 'species',
      minWidth: '200',
    },
    {
      key: 'cf',
      value: 'cf',
      title: 'cf',
      minWidth: '80',
    },
    {
      key: 'sp',
      value: 'sp',
      title: 'sp',
      minWidth: '80',
    },
    {
      key: 'type',
      value: 'type',
      title: 'type',
      minWidth: '80',
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
  labels: ['seed (archaeobotany)', 'seeds (archaeobotany)'],
  name: 'botanySeed',
}

export default config
