import type {DynamicRepositoryConfig} from "~/api/repositories/BaseApiRepository";
import { createRepository} from "./RepositoryFactory";

export class SiteRepository extends createRepository({
  collectionPath: '/api/sites',
  itemPath: '/api/sites/{id}',
  postPath: '/api/sites',
  deletePath: '/api/sites/{id}',
  patchPath: '/api/sites/{id}'
}) {
  constructor(customPaths?: DynamicRepositoryConfig) {
    super(customPaths);
  }
}
