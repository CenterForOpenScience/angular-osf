import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';

import { JsonApiResource } from '../common/json-api/resource.model';
import { ListResponse } from '../common/json-api/responses.model';
import { UserDataErrorResponseJsonApi } from '../user/user-json-api.model';

export type ContributorsResponseJsonApi = ListResponse<ContributorDataJsonApi>;

export interface ContributorDataJsonApi extends JsonApiResource<'contributors', ContributorAttributesJsonApi> {
  embeds?: ContributorEmbedsJsonApi;
}

interface ContributorAttributesJsonApi {
  bibliographic: boolean;
  index: number;
  is_curator: boolean;
  permission: ContributorPermission;
  unregistered_contributor: string | null;
}

interface ContributorEmbedsJsonApi {
  users: UserDataErrorResponseJsonApi;
}
