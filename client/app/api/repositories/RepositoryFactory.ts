import { BaseApiRepository, type DynamicRepositoryConfig } from "./BaseApiRepository";
import type {
  GetCollectionPath,
  GetItemPath,
  PostCollectionPath,
  DeleteItemPath,
  PatchItemPath,
} from "~~/types";

export type RepositoryConfig<
  CollectionPath extends GetCollectionPath,
  ItemPath extends GetItemPath,
  PostPath extends PostCollectionPath | never = never,
  DeletePath extends DeleteItemPath | never = never,
  PatchPath extends PatchItemPath | never = never
> = {
  collectionPath: CollectionPath
  itemPath?: ItemPath
  postPath?: PostPath
  deletePath?: DeletePath
  patchPath?: PatchPath
}

export function createRepository<
  CollectionPath extends GetCollectionPath,
  ItemPath extends GetItemPath,
  PostPath extends PostCollectionPath | never = never,
  DeletePath extends DeleteItemPath | never = never,
  PatchPath extends PatchItemPath | never = never
>(defaultConfig: RepositoryConfig<CollectionPath, ItemPath, PostPath, DeletePath, PatchPath>) {
  return class extends BaseApiRepository<CollectionPath, ItemPath, PostPath, DeletePath, PatchPath> {
    constructor(runtimeConfig?: DynamicRepositoryConfig) {
      super(defaultConfig, runtimeConfig);
    }
  }
}
