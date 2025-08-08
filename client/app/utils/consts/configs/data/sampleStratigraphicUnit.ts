import type { ResourceConfig } from '~~/types'

export const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/sample_stratigraphic_units',
  appPath: '/data/samples-stratigraphic-units',
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
      key: 'stratigraphicUnit',
      value: 'stratigraphicUnit',
      title: 'stratigraphic unit',
    },
    {
      key: 'sample',
      value: 'sample',
      title: 'sample',
    },
  ],
  labels: ['sample/SU join', 'sample/SU joins'],
  name: 'sampleStratigraphicUnit',
}

export const sampleSubResourceConfig: Readonly<ResourceConfig> = {
  ...structuredClone(config),
  ...{
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
        key: 'sample.code',
        value: 'sample.code',
        title: 'code',
        sortable: false,
      },
      {
        key: 'sample.type.value',
        value: 'sample.type.value',
        title: 'type',
      },
      {
        key: 'sample.year',
        value: 'sample.year',
        title: 'year',
      },
      {
        key: 'sample.number',
        value: 'sample.number',
        title: 'number',
      },
      {
        key: 'sample.description',
        value: 'sample.description',
        title: 'description',
        sortable: false,
      },
    ],
  },
}

export const stratigraphicUnitSubResourceConfig: Readonly<ResourceConfig> = {
  ...structuredClone(config),
  ...{
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
        value: 'site.code',
        title: 'site',
        width: '80',
      },
      {
        key: 'stratigraphicUnit.code',
        value: 'stratigraphicUnit.code',
        title: 'code',
        width: '200',
        sortable: false,
      },
      {
        key: 'stratigraphicUnit.number',
        value: 'stratigraphicUnit.number',
        title: 'number',
      },
      {
        key: 'stratigraphicUnit.year',
        value: 'stratigraphicUnit.year',
        title: 'year',
      },
      {
        key: 'stratigraphicUnit.interpretation',
        value: 'stratigraphicUnit.interpretation',
        title: 'interpretation',
        sortable: false,
      },
      {
        key: 'stratigraphicUnit.description',
        value: 'stratigraphicUnit.description',
        title: 'description',
        sortable: false,
      },
    ],
  },
}
