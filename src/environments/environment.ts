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
   * URL used for file downloads from OSF.
   */
  downloadUrl: 'https://staging4.osf.io/download',
  /**
   * Base URL for the OSF JSON:API v2 endpoints.
   */
  apiUrl: 'https://api.staging4.osf.io/v2',
  /**
   * Legacy v1 API endpoint used by some older services.
   */
  apiUrlV1: 'https://staging4.osf.io/api/v1',
  /**
   * Domain URL used for JSON:API v2 services.
   */
  apiDomainUrl: 'https://api.staging4.osf.io',
  /**
   * Base URL for SHARE discovery search (Trove).
   */
  shareDomainUrl: 'https://staging-share.osf.io/trove',
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
   * Duplicate of `addonsApiUrl`, retained for backwards compatibility.
   */
  addonsV1Url: 'https://addons.staging4.osf.io/v1',
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
};
