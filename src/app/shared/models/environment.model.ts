export interface AppEnvironment {
  production: boolean;
  webUrl: string;
  apiDomainUrl: string;
  shareTroveUrl: string;
  addonsApiUrl: string;
  fileApiUrl: string;
  funderApiUrl: string;
  casUrl: string;
  recaptchaSiteKey: string;
  twitterHandle: string;
  facebookAppId: string;
  supportEmail: string;
  defaultProvider: string;
  dataciteTrackerRepoId: string | null;
  dataciteTrackerAddress: string;

  activityLogs?: {
    pageSize?: number;
  };
}
