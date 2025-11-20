import type {
  ApiResourceKey,
  PostCollectionPath,
  PostCollectionRequestMap,
  ResourceParent,
} from '~~/types'

export const generateEmptyAnalysisSubjectModel = (
  subjectKey: ApiResourceKey,
  parent?: ResourceParent<ApiResourceKey>,
): {
  analysis?: string
  subject?: string
  summary?: string | null
} => {
  return {
    ...(parent?.key === 'analysis'
      ? { analysis: parent.item['@id'] as string }
      : {}),
    ...(parent?.key === subjectKey
      ? { subject: parent.item['@id'] as string }
      : {}),
    summary: null,
  }
}

const EMPTY_POST_MODEL_MAP: {
  [K in PostCollectionPath]?: (
    parent?: ResourceParent<ApiResourceKey>,
  ) => Partial<PostCollectionRequestMap[K]>
} = {
  '/api/admin/site_user_privileges': (parent) => ({
    user: parent?.key === 'user' ? parent.item['@id'] : undefined,
    site: parent?.key === 'site' ? parent.item['@id'] : undefined,
  }),
  '/api/admin/users': (_parent) => ({
    enabled: true,
    roles: [] as string[],
  }),
  '/api/data/analyses/botany/charcoals': (parent) => {
    return generateEmptyAnalysisSubjectModel('botanyCharcoal', parent)
  },
  '/api/data/analyses/botany/seeds': (parent) => {
    return generateEmptyAnalysisSubjectModel('botanySeed', parent)
  },
  '/api/data/analyses/contexts/botany': (parent) => {
    return generateEmptyAnalysisSubjectModel('context', parent)
  },
  '/api/data/analyses/contexts/zoo': (parent) => {
    return generateEmptyAnalysisSubjectModel('context', parent)
  },
  '/api/data/analyses/individuals': (parent) => {
    return generateEmptyAnalysisSubjectModel('individual', parent)
  },
  '/api/data/analyses/potteries': (parent) => {
    return generateEmptyAnalysisSubjectModel('pottery', parent)
  },
  '/api/data/analyses/zoo/bones': (parent) => {
    return generateEmptyAnalysisSubjectModel('zooBone', parent)
  },
  '/api/data/analyses/zoo/teeth': (parent) => {
    return generateEmptyAnalysisSubjectModel('zooTooth', parent)
  },
  '/api/data/analyses/samples/microstratigraphy': (parent) => {
    return generateEmptyAnalysisSubjectModel('sample', parent)
  },
  '/api/data/analyses/sites/anthropology': (parent) => {
    return generateEmptyAnalysisSubjectModel('site', parent)
  },
  '/api/data/botany/seeds': (parent) => ({
    stratigraphicUnit:
      parent?.key === 'stratigraphicUnit' ? parent.item['@id'] : undefined,
    taxonomy: null,
    element: null,
    part: null,
  }),
  '/api/data/contexts': (parent) => ({
    site: parent?.key === 'site' ? parent.item['@id'] : undefined,
  }),
  '/api/data/context_stratigraphic_units': (parent) => ({
    context: parent?.key === 'context' ? parent.item['@id'] : undefined,
    stratigraphicUnit:
      parent?.key === 'stratigraphicUnit' ? parent.item['@id'] : undefined,
  }),
  '/api/data/history/plants': (parent) => ({
    location:
      parent?.key === 'vocHistoryLocation' ? parent.item['@id'] : undefined,
  }),
  '/api/data/individuals': (parent) => ({
    stratigraphicUnit:
      parent?.key === 'stratigraphicUnit' ? parent.item['@id'] : undefined,
  }),
  '/api/data/media_objects': (_parent) => ({
    type: undefined,
    description: undefined,
    file: undefined,
  }),
  '/api/data/microstratigraphic_units': (parent) => ({
    stratigraphicUnit:
      parent?.key === 'stratigraphicUnit' ? parent.item['@id'] : undefined,
  }),
  '/api/data/potteries': (parent) => ({
    stratigraphicUnit:
      parent?.key === 'stratigraphicUnit' ? parent.item['@id'] : undefined,
  }),
  '/api/data/sample_stratigraphic_units': (parent) => ({
    stratigraphicUnit:
      parent?.key === 'stratigraphicUnit' ? parent.item['@id'] : undefined,
    sample: parent?.key === 'sample' ? parent.item['@id'] : undefined,
  }),
  '/api/data/samples': (parent) => ({
    site: parent?.key === 'site' ? parent.item['@id'] : undefined,
  }),
  '/api/data/sediment_cores': (parent) => ({
    site: parent?.key === 'site' ? parent.item['@id'] : undefined,
  }),
  '/api/data/sediment_core_depths': (parent) => ({
    stratigraphicUnit:
      parent?.key === 'stratigraphicUnit' ? parent.item['@id'] : undefined,
    sedimentCore:
      parent?.key === 'sedimentCore' ? parent.item['@id'] : undefined,
  }),
  '/api/data/stratigraphic_units': (parent) => ({
    site: parent?.key === 'site' ? parent.item['@id'] : undefined,
  }),
  '/api/data/zoo/bones': (parent) => ({
    stratigraphicUnit:
      parent?.key === 'stratigraphicUnit' ? parent.item['@id'] : undefined,
    taxonomy: null,
  }),
  '/api/data/zoo/teeth': (parent) => ({
    stratigraphicUnit:
      parent?.key === 'stratigraphicUnit' ? parent.item['@id'] : undefined,
    taxonomy: null,
    element: null,
    connected: false,
  }),
} as const

export function generateEmptyPostModel<
  P extends PostCollectionPath,
  PK extends ApiResourceKey,
>(path: P, parent?: ResourceParent<PK>) {
  return ref(
    EMPTY_POST_MODEL_MAP[path]?.(parent) ??
      ({} as Partial<PostCollectionRequestMap[P]>),
  )
}

export default generateEmptyPostModel
