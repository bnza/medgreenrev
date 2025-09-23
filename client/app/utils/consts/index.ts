import type { StratigraphicUnitRelationshipKey } from '~~/types'

export const STRATIGRAPHIC_UNIT_RELATIONSHIP_MAP: Record<
  StratigraphicUnitRelationshipKey,
  string
> = {
  c: 'cover to',
  C: 'covered by',
  e: 'same as',
  f: 'fill to',
  F: 'filled by',
  x: 'cuts',
  X: 'cut by',
} as const

export enum AnalysisGroups {
  AbsoluteDating = 'absolute dating',
  Anthropology = 'anthropology',
  Archaeobotany = 'archaeobotany',
  SedimentCores = 'sediment cores',
  MaterialAnalysis = 'material analysis',
  Micromorphology = 'micromorphology',
  Microscope = 'microscope',
  Zooarchaeology = 'zooarchaeology',
}
