import type {GetCollectionPath, GetItemPath} from "~~/types";
import {BaseApiRepository} from "./BaseApiRepository";

export class SiteRepository<
  TCollectionPath extends GetCollectionPath = '/api/sites',
  TItemPath extends GetItemPath = '/api/sites/{id}'
> extends BaseApiRepository<TCollectionPath, TItemPath> {
  protected getDefaultCollectionPath(): TCollectionPath {
    return '/api/sites' as TCollectionPath;
  }

  protected getDefaultItemPath(): TItemPath {
    return '/api/sites/{id}' as TItemPath;
  }
}
