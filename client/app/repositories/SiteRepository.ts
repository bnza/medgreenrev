import type {GetCollectionPath, GetCollectionResponseMap, GetItemPath, GetItemResponseMap} from "~~/types";
import {BaseApiRepository} from "./BaseApiRepository";


export class SiteRepository<
  TCollectionPath extends GetCollectionPath,
  TItemPath extends GetItemPath
> extends BaseApiRepository<TCollectionPath, TItemPath> {
}
