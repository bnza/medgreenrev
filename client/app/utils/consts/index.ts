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
  Assemblage = 'assemblage',
  AbsoluteDating = 'absolute dating',
  SedimentCores = 'sediment cores',
  MaterialAnalysis = 'material analysis',
  Micromorphology = 'micromorphology',
  Microscope = 'microscope',
}

export const ANALYSIS_TYPE_MAP: Record<
  string,
  { group: AnalysisGroups; value: string }
> = {
  ANTHRA: { group: AnalysisGroups.Assemblage, value: 'anthracology' },
  CARP: { group: AnalysisGroups.Assemblage, value: 'carpology' },
  ADNA: { group: AnalysisGroups.MaterialAnalysis, value: 'aDNA' },
  ISO: { group: AnalysisGroups.MaterialAnalysis, value: 'isotopes' },
  ORA: { group: AnalysisGroups.MaterialAnalysis, value: 'ORA' },
  XRF: { group: AnalysisGroups.MaterialAnalysis, value: 'XRF' },
  XRD: { group: AnalysisGroups.MaterialAnalysis, value: 'XRD' },
  C14: { group: AnalysisGroups.AbsoluteDating, value: 'C14' },
  THL: { group: AnalysisGroups.AbsoluteDating, value: 'thermoluminescence' },
  TIN: { group: AnalysisGroups.Micromorphology, value: 'thin section' },
  OPT: { group: AnalysisGroups.Microscope, value: 'optical' },
  SEM: { group: AnalysisGroups.Microscope, value: 'SEM' },
  POL: { group: AnalysisGroups.SedimentCores, value: 'pollen' },
  SDNA: { group: AnalysisGroups.SedimentCores, value: 'sedimentary DNA' },
  ANTHRO: { group: AnalysisGroups.Assemblage, value: 'anthropology' },
  ZOO: { group: AnalysisGroups.Assemblage, value: 'zooarchaeology' },
} as const

export type AnalysisCode = keyof typeof ANALYSIS_TYPE_MAP
