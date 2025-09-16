import { ReviewPermissions } from '@osf/shared/enums';

export interface ProviderModel {
  id: string;
  name: string;
  permissions?: ReviewPermissions[];
}

export interface BaseProviderModel {
  id: string;
  type: string;
  advisoryBoard: string;
  allowCommenting: boolean;
  allowSubmissions: boolean;
  description: string;
  domain: string;
  domainRedirectEnabled: boolean;
  emailSupport: string | null;
  example: string | null;
  facebookAppId: string | null;
  footerLinks: string;
  name: string;
  permissions: ReviewPermissions[];
  reviewsWorkflow: string;
  sharePublishType: string;
  shareSource: string;
}
