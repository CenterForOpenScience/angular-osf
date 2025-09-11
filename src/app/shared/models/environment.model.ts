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

  google?: {
    GOOGLE_FILE_PICKER_CLIENT_ID: string;
    GOOGLE_FILE_PICKER_API_KEY: string;
    GOOGLE_FILE_PICKER_APP_ID: number;
  };

  activityLogs?: {
    pageSize?: number;
  };
}
