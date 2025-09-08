export type ConfigModelType = string | number | boolean | null;

export interface ConfigModel {
  sentryDsn: string;
  [key: string]: ConfigModelType;
}
