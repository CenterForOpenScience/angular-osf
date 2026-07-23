import { JsonApiResource } from './common/json-api/resource.model';
import { ItemResponse } from './common/json-api/responses.model';

export type BannerCurrentResponseJsonApi = ItemResponse<BannerJsonApi>;

export interface BannerJsonApi extends JsonApiResource<string, BannerAttributesJsonApi> {
  links: BannerLinksJsonApi;
}

interface BannerAttributesJsonApi {
  color: string;
  default_alt_text: string;
  end_date: string;
  license: string;
  link: string;
  mobile_alt_text: string;
  name: string;
  start_date: string;
}

interface BannerLinksJsonApi {
  default_photo: string;
  mobile_photo: string;
}
