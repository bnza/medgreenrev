import type {GetCollectionPath, GetItemPath, PostCollectionPath} from "~~/types";
import {BaseApiRepository} from "./BaseApiRepository";

export class SiteRepository<
  TCollectionPath extends GetCollectionPath = '/api/sites',
  TItemPath extends GetItemPath = '/api/sites/{id}',
  TPostPath extends PostCollectionPath = '/api/sites'
> extends BaseApiRepository<TCollectionPath, TItemPath, TPostPath> {
  protected getDefaultCollectionPath() {
    return '/api/sites' as TCollectionPath;
  }

  protected getDefaultItemPath(){
    return '/api/sites/{id}' as TItemPath;
  }

  protected getDefaultPostPath() {
    return '/api/sites' as TPostPath;
  }
}
