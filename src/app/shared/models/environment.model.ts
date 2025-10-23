export interface EnvironmentModel {
  production: boolean;
  webUrl: string;
  apiDomainUrl: string;
  shareTroveUrl: string;
  addonsApiUrl: string;
  funderApiUrl: string;
  casUrl: string;
  recaptchaSiteKey: string;
  twitterHandle: string;
  facebookAppId: string;
  supportEmail: string;
  defaultProvider: string;
  dataciteTrackerRepoId: string | null;
  dataciteTrackerAddress: string;
  newRelic: NewRelicConfig;
  activityLogs?: {
    pageSize?: number;
  };

  /**
   * The DSN (Data Source Name) used to configure Sentry for error tracking.
   * This string is provided by Sentry and uniquely identifies your project.
   *
   * @example "https://1234567890abcdef.ingest.sentry.io/1234567"
   */
  sentryDsn: string;

  /**
   * The Google Tag Manager ID used to embed GTM scripts for analytics tracking.
   * This ID typically starts with "GTM-".
   *
   * @example "GTM-ABCDE123"
   */
  googleTagManagerId: string;

  /**
   * API Key used to load the Google Picker API.
   * This key should be restricted in the Google Cloud Console to limit usage.
   *
   * @example "AIzaSyA...your_api_key"
   */
  googleFilePickerApiKey: string;

  /**
   * Google Cloud Project App ID used by the Google Picker SDK.
   * This numeric ID identifies your Google project and is required for some configurations.
   *
   * @example 123456789012
   */
  googleFilePickerAppId: number;
}

interface NewRelicConfig {
  enabled: boolean;
  init: {
    distributed_tracing: { enabled: boolean };
    performance: { capture_measures: boolean };
    privacy: { cookies_enabled: boolean };
    ajax: { deny_list: string[] };
  };
  info: {
    beacon: string;
    errorBeacon: string;
    licenseKey: string;
    applicationID: string;
    sa: number;
  };
  loader_config: {
    accountID: string;
    trustKey: string;
    agentID: string;
    licenseKey: string;
    applicationID: string;
  };
}
