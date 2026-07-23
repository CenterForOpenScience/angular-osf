import { ResourceLinksJsonApi } from '../common/json-api/links.model';
import { JsonApiResource } from '../common/json-api/resource.model';
import { DataResponse } from '../common/json-api/responses.model';

export type ResourceReferenceResponseJsonApi = DataResponse<ResourceReferenceJsonApi[]>;
export type UserReferenceResponseJsonApi = DataResponse<UserReferenceJsonApi[]>;

export type UserReferenceJsonApi = JsonApiResource<'user-references', UserReferenceAttributesJsonApi>;

export interface ResourceReferenceJsonApi extends JsonApiResource<
  'resource-references',
  ResourceReferenceAttributesJsonApi
> {
  links: Pick<ResourceLinksJsonApi, 'self'>;
}

interface UserReferenceAttributesJsonApi {
  user_uri: string;
}

interface ResourceReferenceAttributesJsonApi {
  resource_uri: string;
}
