import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/zoo/bones',
  appPath: '/data/zoo/bones',
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
      key: 'species.value',
      value: 'species',
      title: 'common name',
      minWidth: '200',
    },
    {
      key: 'species.class',
      value: 'species',
      title: 'class',
      minWidth: '150',
    },
    {
      key: 'species.family',
      value: 'species',
      title: 'family',
      minWidth: '150',
    },
    {
      key: 'species.scientificName',
      value: 'species',
      title: 'species',
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
      key: 'endsPreserved',
      value: 'endsPreserved',
      title: 'ends preserved',
      minWidth: '100',
    },
    {
      key: 'side',
      value: 'side',
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
  labels: ['zoo bone', 'zoo bones'],
  name: 'zooBone',
}

export default config
