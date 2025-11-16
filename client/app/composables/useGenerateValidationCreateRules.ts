import type {
  ApiAnalysisSubjectResourceKey,
  FormDataFields,
  GetValidationPath,
  PostCollectionPath,
  PostCollectionRequestMap,
} from '~~/types'
import {
  createRule,
  type Maybe,
  type RegleComputedRules,
  useRegle,
  useScopedRegle,
} from '@regle/core'
import {
  email,
  integer,
  maxValue,
  minLength,
  minValue,
  numeric,
  required,
  withMessage,
} from '@regle/rules'
import { GetValidationOperation } from '~/api/operations/GetValidationOperation'
import useMaxFileSizeValidationRule from '~/composables/validation/rules/useMaxFileSizeValidationRule'

const { maxFileSize } = useMaxFileSizeValidationRule()

const validationPaths: Record<
  ApiAnalysisSubjectResourceKey,
  GetValidationPath
> = {
  analysisBotanyCharcoal: '/api/validator/unique/analyses/botany/charcoals',
  analysisBotanySeed: '/api/validator/unique/analyses/botany/seeds',
  analysisContextBotany: '/api/validator/unique/analyses/contexts/botany',
  analysisContextZoo: '/api/validator/unique/analyses/contexts/zoo',
  analysisIndividual: '/api/validator/unique/analyses/individuals',
  analysisPottery: '/api/validator/unique/analyses/potteries',
  analysisSampleMicrostratigraphy:
    '/api/validator/unique/analyses/samples/microstratigraphy',
  analysisSiteAnthropology: '/api/validator/unique/analyses/sites/anthropology',
  analysisZooBone: '/api/validator/unique/analyses/zoo/bones',
  analysisZooTooth: '/api/validator/unique/analyses/zoo/teeth',
} as const

export const generateAnalysisSubjectValidationRules = (
  resourceKey: ApiAnalysisSubjectResourceKey,
  model: Ref<Partial<{ analysis: string; subject: string }>>,
) => {
  const path = validationPaths[resourceKey]

  const uniqueSubject = useApiUniqueValidator(
    path,
    ['subject', 'analysis'],
    'Duplicate [subject, analysis] combination',
  )
  const uniqueAnalysis = useApiUniqueValidator(
    path,
    ['analysis', 'subject'],
    'Duplicate [subject, analysis] combination',
  )

  return {
    subject: {
      required,
      unique: uniqueSubject(() => model.value.analysis),
    },
    analysis: {
      required,
      unique: uniqueAnalysis(() => model.value.subject),
    },
  }
}

const CREATION_RULES: {
  [K in PostCollectionPath]?: (
    model: Ref<Partial<PostCollectionRequestMap[K]>>,
  ) => any
} = {
  '/api/admin/site_user_privileges': (model) => {
    const uniqueSite = useApiUniqueValidator(
      '/api/validator/unique/site_user_privileges',
      ['site', 'user'],
      'Duplicate [site, user] combination',
    )

    const uniqueUser = useApiUniqueValidator(
      '/api/validator/unique/site_user_privileges',
      ['user', 'site'],
      'Duplicate [site, user] combination',
    )

    return computed(
      () =>
        ({
          site: {
            required,
            uniqueSite: uniqueSite(() => model.value.user),
          },
          user: {
            required,
            uniqueUser: uniqueUser(() => model.value.site),
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/admin/site_user_privileges']>
        >,
    )
  },
  '/api/admin/users': (_model) => {
    return computed(
      () =>
        ({
          email: { required, email },
          roles: { required, minLength: minLength(1) },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/admin/users']>
        >,
    )
  },
  '/api/data/analyses': (model) => {
    const uniqueType = useApiUniqueValidator(
      '/api/validator/unique/analyses',
      ['type', 'identifier'],
      'Duplicate [type, identifier] combination',
    )
    const uniqueIdentifier = useApiUniqueValidator(
      '/api/validator/unique/analyses',
      ['identifier', 'type'],
      'Duplicate [type, identifier] combination',
    )
    return computed(
      () =>
        ({
          type: {
            required,
            uniqueType: uniqueType(() => model.value.identifier),
          },
          year: {
            required,
            integer,
            minValue: minValue(2000),
            maxValue: maxValue(new Date().getFullYear()),
          },
          identifier: {
            required,
            uniqueIdentifier: uniqueIdentifier(() => model.value.type),
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/analyses']>
        >,
    )
  },
  '/api/data/analyses/botany/charcoals': (model) => {
    return generateAnalysisSubjectValidationRules(
      'analysisBotanyCharcoal',
      model,
    )
  },
  '/api/data/analyses/botany/seeds': (model) => {
    return generateAnalysisSubjectValidationRules('analysisBotanySeed', model)
  },
  '/api/data/analyses/contexts/botany': (model) => {
    return generateAnalysisSubjectValidationRules(
      'analysisContextBotany',
      model,
    )
  },
  '/api/data/analyses/contexts/zoo': (model) => {
    return generateAnalysisSubjectValidationRules('analysisContextZoo', model)
  },
  '/api/data/analyses/individuals': (model) => {
    return generateAnalysisSubjectValidationRules('analysisIndividual', model)
  },
  '/api/data/analyses/potteries': (model) => {
    return generateAnalysisSubjectValidationRules('analysisPottery', model)
  },
  '/api/data/analyses/zoo/bones': (model) => {
    return generateAnalysisSubjectValidationRules('analysisZooBone', model)
  },
  '/api/data/analyses/zoo/teeth': (model) => {
    return generateAnalysisSubjectValidationRules('analysisZooTooth', model)
  },
  '/api/data/analyses/samples/microstratigraphy': (model) => {
    return generateAnalysisSubjectValidationRules(
      'analysisSampleMicrostratigraphy',
      model,
    )
  },
  '/api/data/analyses/sites/anthropology': (model) => {
    return generateAnalysisSubjectValidationRules(
      'analysisSiteAnthropology',
      model,
    )
  },
  '/api/data/botany/charcoals': (_model) => {
    return computed(
      () =>
        ({
          stratigraphicUnit: { required },
          element: { required },
          taxonomy: { required },
          part: { required },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/botany/charcoals']>
        >,
    )
  },
  '/api/data/botany/seeds': (_model) => {
    return computed(
      () =>
        ({
          stratigraphicUnit: { required },
          element: { required },
          taxonomy: { required },
          part: { required },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/botany/seeds']>
        >,
    )
  },
  '/api/data/contexts': (model) => {
    const uniqueSite = useApiUniqueValidator(
      '/api/validator/unique/contexts',
      ['site', 'name'],
      'Duplicate [number, site, year] combination',
    )
    const uniqueName = useApiUniqueValidator(
      '/api/validator/unique/contexts',
      ['name', 'site'],
      'Duplicate [number, site, year] combination',
    )

    return computed(
      () =>
        ({
          type: { required },
          site: { required, uniqueYear: uniqueSite(() => model.value.name) },
          name: { required, uniqueName: uniqueName(() => model.value.site) },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/contexts']>
        >,
    )
  },
  '/api/data/history/plants': (model) => {
    return computed(
      () =>
        ({
          plant: {
            required,
          },
          location: {
            required,
          },
          chronologyLower: {
            integer,
            minValue: minValue(-32768),
            maxValue: maxValue(new Date().getFullYear()),
            lessThanOrEqual: lessThanOrEqual(
              'Lower chronology must be greater than or equal upper chronology.',
            )(() => model.value.chronologyUpper),
          },
          chronologyUpper: {
            integer,
            minValue: minValue(-32768),
            maxValue: maxValue(new Date().getFullYear()),
            greaterOrEqualThan: greaterThanOrEqual(
              'Upper chronology must be less than or equal lower chronology.',
            )(() => model.value.chronologyLower),
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/history/plants']>
        >,
    )
  },
  '/api/data/individuals': (_model) => {
    const validator = new GetValidationOperation(
      '/api/validator/unique/individuals/identifier',
    )
    const uniqueIdentifier = createRule({
      validator: async (value: Maybe<string>) =>
        value ? await validator.isValid({ identifier: value }) : true,
      message: 'Identifier must be unique',
    })

    return computed(
      () =>
        ({
          stratigraphicUnit: {
            required,
          },
          identifier: {
            required,
            unique: uniqueIdentifier,
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/individuals']>
        >,
    )
  },
  '/api/data/media_objects': (_model) => {
    const validator = new GetValidationOperation(
      '/api/validator/unique/media_objects/sha256',
    )
    const uniqueFile = createRule({
      validator: async (value: Maybe<File>) =>
        value
          ? await validator.isValid({
              sha256: await calculateSHA256FileHash(value),
            })
          : true,
      message: 'Duplicate file',
    })

    return computed(
      () =>
        ({
          file: {
            required: withMessage(required, 'File is required'),
            uniqueFile,
            maxFileSize,
          },
          type: {
            required,
          },
        }) satisfies RegleComputedRules<
          FormDataFields<'/api/data/media_objects'>
        >,
    )
  },
  '/api/data/microstratigraphic_units': (model) => {
    const uniqueStratigraphicUnit = useApiUniqueValidator(
      '/api/validator/unique/microstratigraphic_units',
      ['stratigraphicUnit', 'identifier'],
      'Duplicate [stratigraphic unit, identifier] combination',
    )

    const uniqueIdentifier = useApiUniqueValidator(
      '/api/validator/unique/microstratigraphic_units',
      ['identifier', 'stratigraphicUnit'],
      'Duplicate [stratigraphic unit, identifier] combination',
    )

    return computed(
      () =>
        ({
          stratigraphicUnit: {
            required,
            unique: uniqueStratigraphicUnit(() => model.value.identifier),
          },
          identifier: {
            required,
            unique: uniqueIdentifier(() => model.value.stratigraphicUnit),
          },
        }) satisfies RegleComputedRules<
          Partial<
            PostCollectionRequestMap['/api/data/microstratigraphic_units']
          >
        >,
    )
  },
  '/api/data/potteries': (model) => {
    const validator = new GetValidationOperation(
      '/api/validator/unique/individuals/identifier',
    )
    const uniqueInventory = createRule({
      validator: async (value: Maybe<string>) =>
        value ? await validator.isValid({ identifier: value }) : true,
      message: 'Inventory must be unique',
    })

    return computed(
      () =>
        ({
          stratigraphicUnit: {
            required,
          },
          inventory: {
            required,
            unique: uniqueInventory,
          },
          functionalGroup: {
            required,
          },
          functionalForm: {
            required,
          },
          chronologyLower: {
            integer,
            minValue: minValue(-32768),
            maxValue: maxValue(new Date().getFullYear()),
            lessThanOrEqual: lessThanOrEqual(
              'Lower chronology must be greater than or equal upper chronology.',
            )(() => model.value.chronologyUpper),
          },
          chronologyUpper: {
            integer,
            minValue: minValue(-32768),
            maxValue: maxValue(new Date().getFullYear()),
            greaterOrEqualThan: greaterThanOrEqual(
              'Upper chronology must be less than or equal lower chronology.',
            )(() => model.value.chronologyLower),
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/potteries']>
        >,
    )
  },
  '/api/data/sample_stratigraphic_units': (model) => {
    const uniqueStratigraphicUnit = useApiUniqueValidator(
      '/api/validator/unique/sample_stratigraphic_units',
      ['stratigraphicUnit', 'sample'],
      'Duplicate [stratigraphic unit, sample] combination',
    )
    const uniqueSample = useApiUniqueValidator(
      '/api/validator/unique/sample_stratigraphic_units',
      ['sample', 'stratigraphicUnit'],
      'Duplicate [stratigraphic unit, sample] combination',
    )

    return computed(
      () =>
        ({
          sample: {
            required,
            uniqueSample: uniqueSample(() => model.value.stratigraphicUnit),
          },
          stratigraphicUnit: {
            required,
            uniqueStratigraphicUnit: uniqueStratigraphicUnit(
              () => model.value.sample,
            ),
          },
        }) satisfies RegleComputedRules<
          Partial<
            PostCollectionRequestMap['/api/data/sample_stratigraphic_units']
          >
        >,
    )
  },
  '/api/data/samples': (model) => {
    const uniqueSite = useApiUniqueValidator(
      '/api/validator/unique/samples',
      ['site', 'type', 'year', 'number'],
      'Duplicate [site, type, year, number] combination',
    )
    const uniqueType = useApiUniqueValidator(
      '/api/validator/unique/samples',
      ['type', 'site', 'year', 'number'],
      'Duplicate [site, type, year, number] combination',
    )
    const uniqueYear = useApiUniqueValidator(
      '/api/validator/unique/samples',
      ['year', 'site', 'type', 'number'],
      'Duplicate [site, type, year, number] combination',
    )
    const uniqueNumber = useApiUniqueValidator(
      '/api/validator/unique/samples',
      ['number', 'site', 'type', 'year'],
      'Duplicate [site, type, year, number] combination',
    )

    return computed(
      () =>
        ({
          site: {
            required,
            uniqueSite: uniqueSite(
              () => model.value.type,
              () => model.value.year,
              () => model.value.number,
            ),
          },
          type: {
            required,
            uniqueType: uniqueType(
              () => model.value.site,
              () => model.value.year,
              () => model.value.number,
            ),
          },
          year: {
            uniqueYear: uniqueYear(
              () => model.value.site,
              () => model.value.type,
              () => model.value.number,
            ),
            minValue: minValue(2000),
            maxValue: maxValue(new Date().getFullYear()),
          },
          number: {
            required,
            minValue: minValue(1),
            uniqueNumber: uniqueNumber(
              () => model.value.site,
              () => model.value.type,
              () => model.value.year,
            ),
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/samples']>
        >,
    )
  },
  '/api/data/sediment_cores': (model) => {
    const uniqueSite = useApiUniqueValidator(
      '/api/validator/unique/sediment_cores',
      ['site', 'year', 'number'],
      'Duplicate [site, year, number] combination',
    )
    const uniqueYear = useApiUniqueValidator(
      '/api/validator/unique/sediment_cores',
      ['year', 'site', 'number'],
      'Duplicate [site, year, number] combination',
    )
    const uniqueNumber = useApiUniqueValidator(
      '/api/validator/unique/sediment_cores',
      ['number', 'site', 'year'],
      'Duplicate [site, year, number] combination',
    )

    return computed(
      () =>
        ({
          site: {
            required,
            uniqueSite: uniqueSite(
              () => model.value.year,
              () => model.value.number,
            ),
          },
          year: {
            uniqueYear: uniqueYear(
              () => model.value.site,
              () => model.value.number,
            ),
            minValue: minValue(2000),
            maxValue: maxValue(new Date().getFullYear()),
          },
          number: {
            required,
            minValue: minValue(1),
            uniqueNumber: uniqueNumber(
              () => model.value.site,
              () => model.value.year,
            ),
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/sediment_cores']>
        >,
    )
  },
  '/api/data/sediment_core_depths': (model) => {
    const uniqueSedimentCore = useApiUniqueValidator(
      '/api/validator/unique/sediment_core_depths',
      ['sedimentCore', 'depthMin'],
      'Duplicate [sediment core, depth (min)] combination',
    )
    const uniqueDepthMin = useApiUniqueValidator(
      '/api/validator/unique/sediment_core_depths',
      ['depthMin', 'sedimentCore'],
      'Duplicate [sediment core, depth (min)] combination',
    )

    return computed(
      () =>
        ({
          sedimentCore: {
            required,
            unique: uniqueSedimentCore(() => model.value.depthMin),
          },
          stratigraphicUnit: {
            required,
          },
          depthMin: {
            required,
            numeric,
            lessThan: lessThan('Min depth must be less than max depth.')(() =>
              Number(model.value.depthMax),
            ),
            unique: uniqueDepthMin(() => model.value.sedimentCore),
          },
          depthMax: {
            required,
            numeric,
            greaterThan: greaterThan(
              'Max depth must be greater than min depth.',
            )(() => Number(model.value.depthMin)),
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/sediment_core_depths']>
        >,
    )
  },
  '/api/data/sites': (model) => {
    const apiCodeValidator = new GetValidationOperation(
      '/api/validator/unique/sites/code',
    )

    const apiNameValidator = new GetValidationOperation(
      '/api/validator/unique/sites/name',
    )

    const uniqueCode = createRule({
      validator: async (value: Maybe<string>) =>
        value ? await apiCodeValidator.isValid({ code: value }) : true,
      message: 'Code must be unique',
    })

    const uniqueName = createRule({
      validator: async (value: Maybe<string>) =>
        value ? await apiNameValidator.isValid({ name: value }) : true,
      message: 'Name must be unique',
    })

    return computed(
      () =>
        ({
          code: {
            required,
            unique: uniqueCode,
          },
          name: {
            required,
            unique: uniqueName,
          },
          chronologyLower: {
            integer,
            minValue: minValue(-32768),
            maxValue: maxValue(new Date().getFullYear()),
            lessThanOrEqual: lessThanOrEqual(
              'Lower chronology must be greater than or equal upper chronology.',
            )(() => model.value.chronologyUpper),
          },
          chronologyUpper: {
            integer,
            minValue: minValue(-32768),
            maxValue: maxValue(new Date().getFullYear()),
            greaterOrEqualThan: greaterThanOrEqual(
              'Upper chronology must be less than or equal lower chronology.',
            )(() => model.value.chronologyLower),
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/sites']>
        >,
    )
  },
  '/api/data/stratigraphic_units': (model) => {
    const uniqueSite = useApiUniqueValidator(
      '/api/validator/unique/stratigraphic_units',
      ['site', 'year', 'number'],
      'Duplicate [site, year, number] combination',
    )
    const uniqueYear = useApiUniqueValidator(
      '/api/validator/unique/stratigraphic_units',
      ['year', 'site', 'number'],
      'Duplicate [year, site, number] combination',
    )
    const uniqueNumber = useApiUniqueValidator(
      '/api/validator/unique/stratigraphic_units',
      ['number', 'site', 'year'],
      'Duplicate [number, site, year] combination',
    )

    return computed(
      () =>
        ({
          site: {
            required,
            uniqueSite: uniqueSite(
              () => model.value.year || 0,
              () => model.value.number,
            ),
          },
          year: {
            integer,
            uniqueYear: uniqueYear(
              () => model.value.site,
              () => model.value.number,
            ),
            minValue: minValue(2000),
            maxValue: maxValue(new Date().getFullYear()),
          },
          number: {
            required,
            integer,
            minValue: minValue(1),
            uniqueNumber: uniqueNumber(
              () => model.value.site,
              () => model.value.year || 0,
            ),
          },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/stratigraphic_units']>
        >,
    )
  },
  '/api/data/zoo/bones': (_model) => {
    return computed(
      () =>
        ({
          stratigraphicUnit: { required },
          taxonomy: { required },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/zoo/bones']>
        >,
    )
  },
  '/api/data/zoo/teeth': (_model) => {
    return computed(
      () =>
        ({
          stratigraphicUnit: { required },
          element: { required },
          taxonomy: { required },
          connected: { required },
        }) satisfies RegleComputedRules<
          Partial<PostCollectionRequestMap['/api/data/zoo/teeth']>
        >,
    )
  },
} as const

const defaultRules = <P extends PostCollectionPath>(
  _model: Ref<Partial<PostCollectionRequestMap[P]>>,
) =>
  computed(
    () =>
      ({}) satisfies RegleComputedRules<Partial<PostCollectionRequestMap[P]>>,
  )

export function useGenerateValidationCreateRule<P extends PostCollectionPath>(
  model: Ref<Partial<PostCollectionRequestMap[P]>>,
  path: P,
  scoped = false,
) {
  const rulesFactory = path
    ? (CREATION_RULES[path] ?? defaultRules)
    : defaultRules

  const rules = rulesFactory(model)

  return scoped ? useScopedRegle(model, rules) : useRegle(model, rules)
}

export default useGenerateValidationCreateRule
