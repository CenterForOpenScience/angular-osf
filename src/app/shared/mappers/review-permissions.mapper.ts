import { ReviewPermissions } from '../enums/review-permissions.enum';
import { ProviderDataJsonApi } from '../models';

export class ReviewPermissionsMapper {
  static fromProviderResponse(response: ProviderDataJsonApi): boolean {
    return response.attributes?.permissions?.includes(ReviewPermissions.ViewSubmissions) || false;
  }
}
