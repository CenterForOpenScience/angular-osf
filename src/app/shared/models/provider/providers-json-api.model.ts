import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';

import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '../common/json-api.model';

export interface ProvidersResponseJsonApi {
  data: ProviderDataJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export type ProviderDataJsonApi = ApiData<ProviderAttributesJsonApi, null, null, null>;

interface ProviderAttributesJsonApi {
  name: string;
  permissions?: ReviewPermissions[];
}
