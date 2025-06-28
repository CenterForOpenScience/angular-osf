import { ApiData, MetaJsonApi, PaginationLinksJsonApi } from '@osf/core/models';

export interface ProvidersResponseJsonApi {
  data: ProviderDataJsonApi[];
  meta: MetaJsonApi;
  links: PaginationLinksJsonApi;
}

export type ProviderDataJsonApi = ApiData<ProviderAttributesJsonApi, null, null, null>;

interface ProviderAttributesJsonApi {
  name: string;
}
