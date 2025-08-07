import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '@osf/core/models';
import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';

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
