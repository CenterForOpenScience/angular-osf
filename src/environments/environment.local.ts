export const environment = {
  production: false,
  webUrl: 'http://localhost:5000',
  downloadUrl: 'http://localhost:5000/download',
  apiUrl: 'http://localhost:8000/v2',
  apiUrlV1: 'http://localhost:5000/api/v1',
  apiDomainUrl: 'http://localhost:8000',
  shareDomainUrl: 'https://localhost:8003/trove',
  addonsApiUrl: 'http://localhost:8004/v1',
  fileApiUrl: 'http://localhost:7777/v1',
  funderApiUrl: 'https://api.crossref.org/',
  addonsV1Url: 'http://localhost:8004/v1',
  casUrl: 'http://localhost:8080',
  recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  twitterHandle: 'OSFramework',
  facebookAppId: '1022273774556662',
  supportEmail: 'support@osf.io',
  defaultProvider: 'osf',
  dataciteTrackerRepoId: null,
  dataciteTrackerAddress: 'https://analytics.datacite.org/api/metric',
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
