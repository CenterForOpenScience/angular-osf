import { JsonApiResource } from '../common/json-api/resource.model';

export type BrandDataJsonApi = JsonApiResource<'brands', BrandAttributesJsonApi>;

interface BrandAttributesJsonApi {
  name: string;
  hero_logo_image: string;
  hero_background_image: string;
  topnav_logo_image: string;
  primary_color: string;
  secondary_color: string;
  background_color: string;
}
