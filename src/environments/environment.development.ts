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
  production: false,
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
   * URL for file-related operations on the US storage region.
   */
  fileApiUrl: 'https://files.us.staging4.osf.io/v1',
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
    /**
     * OAuth 2.0 Client ID used to identify the application during Google authentication.
     * Registered in Google Cloud Console under "OAuth 2.0 Client IDs".
     * Safe to expose in frontend code.
     * @see https://console.cloud.google.com/apis/credentials
     */
    GOOGLE_FILE_PICKER_CLIENT_ID: '610901277352-m5krehjdtu8skh2teq85fb7mvk411qa6.apps.googleusercontent.com',
    /**
     * Public API key used to load Google Picker and other Google APIs that don’t require user auth.
     * Must be restricted by referrer in Google Cloud Console.
     * Exposing this key is acceptable if restricted properly.
     * @see https://developers.google.com/maps/api-key-best-practices
     */
    GOOGLE_FILE_PICKER_API_KEY: 'AIzaSyA3EnD0pOv4v7sJt7BGuR1i2Gcj-Gju6C0',
    /**
     * Google Cloud Project App ID.
     * Used for associating API requests with the specific Google project.
     * Required for Google Picker configuration.
     */
    GOOGLE_FILE_PICKER_APP_ID: 610901277352,
  },
};
