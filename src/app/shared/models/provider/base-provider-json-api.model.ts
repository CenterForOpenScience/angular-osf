import { ReviewPermissions } from '@osf/shared/enums';

export interface BaseProviderAttributesJsonApi {
  name: string;
  description: string;
  advisory_board: string;
  example: string | null;
  domain: string;
  domain_redirect_enabled: boolean;
  footer_links: string;
  email_support: string | null;
  facebook_app_id: string | null;
  allow_submissions: boolean;
  allow_commenting: boolean;
  share_source: string;
  share_publish_type: string;
  permissions: ReviewPermissions[];
  reviews_workflow: string;
}
