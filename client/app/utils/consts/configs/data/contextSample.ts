import type { ResourceConfig } from '~~/types'

export const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/context_samples',
  appPath: '/data/contexts-samples',
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
      key: 'sample',
      value: 'sample',
      title: 'sample',
    },
    {
      key: 'context',
      value: 'context',
      title: 'context',
    },
  ],
  labels: ['context/sample join', 'context/sample joins'],
  name: 'contextSample',
}

export const contextSubResourceConfig: Readonly<ResourceConfig> = {
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
        key: 'context.type.group',
        value: 'context.type.group',
        title: 'group',
      },
      {
        key: 'context.type.value',
        value: 'context.type.value',
        title: 'type',
      },
      {
        key: 'context.name',
        value: 'context.name',
        title: 'name',
      },
      {
        key: 'context.description',
        value: 'context.description',
        title: 'description',
        sortable: false,
      },
    ],
  },
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
