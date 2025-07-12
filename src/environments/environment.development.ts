export const environment = {
  production: false,
  webUrl: 'http://localhost:8000',
  downloadUrl: 'http://localhost:8000/download',
  apiUrl: 'http://localhost:8000/v2',
  apiUrlV1: 'https//localhost:8000/api/v1',
  apiDomainUrl: 'http://localhost:8000',
  shareDomainUrl: 'https://staging-share.osf.io/trove',
  addonsApiUrl: 'http://localhost:8000/v1',
  fileApiUrl: 'http://localhost:8000/v1',
  baseResourceUri: 'http://localhost:8000/',
  funderApiUrl: 'http://api.crossref.org/',

  cookieAuth: {
    enabled: true,
    csrfCookieName: 'api-csrf',
    withCredentials: true,
  },
};
