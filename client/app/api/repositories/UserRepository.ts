import type {DynamicRepositoryConfig} from "./BaseApiRepository";
import type { OperationDetails } from "~~/types";
import { createRepository} from "./RepositoryFactory";
export class UserRepository extends createRepository({
  collectionPath: '/api/users',
  itemPath: '/api/users/{id}',
  postPath: '/api/users',
}) {
  constructor(customPaths?: DynamicRepositoryConfig) {
    super(customPaths);
  }

  getUsersMe() {
    return this._request<OperationDetails<'/api/users/me', 'get'>['responses']['200']['content']['application/ld+json']>('/api/users/me')
  }
}
