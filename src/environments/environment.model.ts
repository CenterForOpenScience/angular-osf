export interface Environment {
  production: boolean;
  envName: string;
  apiHost: string;
  defaultLanguage?: string;
  supportedUiLanguages?: string[];
  // theme: 'dark' | 'light'; customize theme for PrimeNG
}
