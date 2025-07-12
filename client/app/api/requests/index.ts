import {diff} from 'deep-object-diff'
import type {PatchItemPath, PatchItemRequestMap, PostCollectionPath, PostCollectionRequestMap} from "~~/types";

export type Normalizer<P extends PostCollectionPath> = (value: Record<string, any>) => Partial<PostCollectionRequestMap[P]>

export type PatchNormalizer<P extends PatchItemPath> = (normalizer: Normalizer<PostCollectionPath>) => (value: Record<string, any>, oldValue: Record<string, any>) => Partial<PatchItemRequestMap[P]>

const defaultNormalize: Normalizer<PostCollectionPath> = (value: Record<string, any>) => structuredClone(toRaw(value))

const defaultPatchNormalize: PatchNormalizer<PatchItemPath> = (normalize: Normalizer<PostCollectionPath>) => (oldValue: Record<string, any>, value: Record<string, any>) => {
  const oldNormalized = normalize(oldValue)
  const newNormalized = normalize(value)
  const diffed = diff(oldNormalized, newNormalized)
  return diffed
}

const NORMALIZER_MAP = {

} as const as Partial<Record<PostCollectionPath, Normalizer<PostCollectionPath>>>

export const getNormalizer = (path: PostCollectionPath | PatchItemPath) => {
  const postPath = path.replace(/\/\{id\}$/, '') as PostCollectionPath
  return  NORMALIZER_MAP[postPath] ?? defaultNormalize
}

export const getPatchNormalizer = (path: PatchItemPath) => {
  const postPath = path.replace(/\/\{id\}$/, '') as PostCollectionPath
  const normalizer = getNormalizer(postPath)
  return defaultPatchNormalize(normalizer)
}
