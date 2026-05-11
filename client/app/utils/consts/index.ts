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
  MaterialAnalysis = 'material analysis',
  Micromorphology = 'micromorphology',
  Microscope = 'microscope',
}

export const ANALYSIS_TYPE_MAP: Record<
  string,
  { group: AnalysisGroups; value: string }
> = {
  C14: { group: AnalysisGroups.AbsoluteDating, value: 'C14' },
  THL: { group: AnalysisGroups.AbsoluteDating, value: 'thermoluminescence' },
  OSL: { group: AnalysisGroups.AbsoluteDating, value: 'optical simulated luminescence' },
  ANTX: { group: AnalysisGroups.Assemblage, value: 'anthracology' },
  ANTH: { group: AnalysisGroups.Assemblage, value: 'anthropology' },
  CARP: { group: AnalysisGroups.Assemblage, value: 'carpology' },
  ZOO: { group: AnalysisGroups.Assemblage, value: 'zooarchaeology' },
  POL: { group: AnalysisGroups.Assemblage, value: 'pollen' },
  SDNA: { group: AnalysisGroups.Assemblage, value: 'sedimentary DNA' },
  PHY: { group: AnalysisGroups.Assemblage, value: 'phytoliths' },
  ADNA: { group: AnalysisGroups.MaterialAnalysis, value: 'aDNA' },
  ISO: { group: AnalysisGroups.MaterialAnalysis, value: 'isotopes' },
  ORA: { group: AnalysisGroups.MaterialAnalysis, value: 'ORA' },
  XRF: { group: AnalysisGroups.MaterialAnalysis, value: 'XRF' },
  XRD: { group: AnalysisGroups.MaterialAnalysis, value: 'XRD' },
  GEO: { group: AnalysisGroups.MaterialAnalysis, value: 'geochemistry' },
  THS: { group: AnalysisGroups.Micromorphology, value: 'thin section' },
  OPT: { group: AnalysisGroups.Microscope, value: 'optical' },
  SEM: { group: AnalysisGroups.Microscope, value: 'SEM' },
} as const

export type AnalysisCode = keyof typeof ANALYSIS_TYPE_MAP
