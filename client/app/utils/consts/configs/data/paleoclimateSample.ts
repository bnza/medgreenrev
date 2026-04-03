import type { ResourceConfig } from '~~/types'

const config: Readonly<ResourceConfig> = {
  apiPath: '/api/data/paleoclimate_samples',
  appPath: '/data/paleoclimate/samples',
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
      key: 'site.code',
      value: 'site.code',
      title: 'site',
      width: '200',
    },
    {
      key: 'code',
      value: 'code',
      title: 'code',
      width: '200',
    },
    {
      key: 'number',
      value: 'number',
      title: 'number',
      width: '200',
    },
    {
      key: 'length',
      value: 'length',
      title: 'sample length (mm)',
      width: '200',
    },
    {
      key: 'chronologyLower',
      value: 'chronologyLower',
      title: 'chronology (lower)',
      minWidth: '200',
    },
    {
      key: 'chronologyUpper',
      value: 'chronologyUpper',
      title: 'chronology (upper)',
      minWidth: '200',
    },
    {
      key: 'precipitationRecord',
      value: 'precipitationRecord',
      title: 'precipitation (record)',
      minWidth: '200',
    },
    {
      key: 'temperatureRecord',
      value: 'temperatureRecord',
      title: 'temperature (record)',
      minWidth: '200',
    },
    {
      key: 'fluidInclusions',
      value: 'fluidInclusions',
      title: 'fluid inclusions',
      minWidth: '200',
    },
    {
      key: 'petrographicDescriptions',
      value: 'petrographicDescriptions',
      title: 'petrographic descriptions',
      minWidth: '200',
    },
    {
      key: 'stableIsotopes',
      value: 'stableIsotopes',
      title: 'stable isotopes',
      minWidth: '200',
    },
    {
      key: 'traceElements',
      value: 'traceElements',
      title: 'trace elements',
      minWidth: '200',
    },
    {
      key: 'description',
      value: 'description',
      title: 'description',
      sortable: false,
    },
  ],
  labels: ['paleoclimate sample', 'paleoclimate sample'],
  name: 'paleoclimateSample',
}

export default config
