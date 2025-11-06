import { ReviewPermissions } from '@osf/shared/enums/review-permissions.enum';

export interface BaseProviderAttributesJsonApi {
  advisory_board: string;
  allow_commenting: boolean;
  allow_submissions: boolean;
  description: string;
  domain: string;
  domain_redirect_enabled: boolean;
  email_support: string | null;
  example: string | null;
  facebook_app_id: string | null;
  footer_links: string;
  name: string;
  permissions: ReviewPermissions[];
  reviews_workflow: string;
  share_publish_type: string;
  share_source: string;
}
