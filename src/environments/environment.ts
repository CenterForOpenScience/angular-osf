/**
 * Production environment configuration for the OSF Angular application.
 *
 * These values are used at runtime to define base URLs, API endpoints,
 * and third-party integrations. This configuration is typically replaced
 * during the Angular build process depending on the target environment.
 */
export const environment = {
  /**
   * Flag indicating whether the app is running in production mode.
   */
  production: true,
  /**
   * Base URL of the OSF web application.
   */
  webUrl: 'https://staging4.osf.io',
  /**
   * Domain URL used for JSON:API v2 services.
   */
  apiDomainUrl: 'https://api.staging4.osf.io',
  /**
   * Base URL for SHARE discovery search (Trove).
   */
  shareTroveUrl: 'https://staging-share.osf.io/trove',
  /**
   * URL for the OSF Addons API (v1).
   */
  addonsApiUrl: 'https://addons.staging4.osf.io/v1',
  /**
   * API endpoint for funder metadata resolution via Crossref.
   */
  funderApiUrl: 'https://api.crossref.org/',
  /**
   * URL for OSF Central Authentication Service (CAS).
   */
  casUrl: 'https://accounts.staging4.osf.io',
  /**
   * Site key used for reCAPTCHA v2 validation in staging.
   */
  recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  /**
   * Twitter handle for OSF.
   */
  twitterHandle: 'OSFramework',
  /**
   * Facebook App ID used for social authentication or sharing.
   */
  facebookAppId: '1022273774556662',
  /**
   * Support contact email for users.
   */
  supportEmail: 'support@osf.io',
  /**
   * Default provider for OSF content and routing.
   */
  defaultProvider: 'osf',
  dataciteTrackerRepoId: null,
  dataciteTrackerAddress: 'https://analytics.datacite.org/api/metric',

  /**
   * Google File Picker configuration values.
   */
  google: {
    GOOGLE_FILE_PICKER_CLIENT_ID: '610901277352-m5krehjdtu8skh2teq85fb7mvk411qa6.apps.googleusercontent.com',
    GOOGLE_FILE_PICKER_API_KEY: 'AIzaSyA3EnD0pOv4v7sJt7BGuR1i2Gcj-Gju6C0',
    GOOGLE_FILE_PICKER_APP_ID: 610901277352,
  },
};
