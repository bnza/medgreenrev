import type {DynamicRepositoryConfig} from "./BaseApiRepository";
import { createRepository} from "./RepositoryFactory";

export class SiteUserPrivilegeRepository extends createRepository({
  collectionPath: '/api/site_user_privileges',
  itemPath: '/api/site_user_privileges/{id}',
  postPath: '/api/site_user_privileges',
  deletePath: '/api/site_user_privileges/{id}',
  patchPath: '/api/site_user_privileges/{id}'
}) {
  constructor(customPaths?: DynamicRepositoryConfig) {
    super(customPaths);
  }
}
