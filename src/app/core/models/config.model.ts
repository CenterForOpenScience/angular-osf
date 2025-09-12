export type ConfigModelType = string | number | boolean | null;

/**
 * Interface representing the application-wide configuration model
 * loaded from `assets/config/config.json`.
 *
 * This config supports both strongly typed properties and dynamic keys.
 *
 */
export interface ConfigModel {
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
   * A catch-all for additional configuration keys not explicitly defined.
   * Each dynamic property maps to a `ConfigModelType` value.
   *
   * @example
   * {
   *   "featureToggle": true,
   *   "apiUrl": "https://api.example.com"
   * }
   */
  [key: string]: ConfigModelType;
}
