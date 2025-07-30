import { SeverityType } from './severity.type';

export interface StatusInfo {
  label: string;
  severity: SeverityType | null;
}
