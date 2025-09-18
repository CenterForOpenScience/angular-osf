import { BannerModel } from '../../core/components/osf-banners/models/banner.model';
import { BannerJsonApi } from '../models/banner.json-api.model';

/**
 * A utility class for transforming banner data from a JSON:API format
 * to the internal `BannerModel` used throughout the application.
 */
export class BannerMapper {
  /**
   * Converts a `BannerJsonApi` response object into a `BannerModel`.
   *
   * This is typically used when consuming API data from the backend
   * that follows JSON:API conventions and transforming it into a format
   * compatible with UI components and internal logic.
   *
   * @param response - The raw JSON:API response containing banner data.
   * @returns A normalized `BannerModel` with proper types and structure.
   */
  static fromResponse(response: BannerJsonApi): BannerModel {
    return {
      id: response.id,
      startDate: new Date(response.attributes.start_date),
      endDate: new Date(response.attributes.end_date),
      color: response.attributes.color,
      license: response.attributes.license,
      name: response.attributes.name,
      defaultAltText: response.attributes.default_alt_text,
      mobileAltText: response.attributes.mobile_alt_text,
      defaultPhoto: response.links.default_photo,
      mobilePhoto: response.links.mobile_photo,
      link: response.attributes.link,
    };
  }
}
