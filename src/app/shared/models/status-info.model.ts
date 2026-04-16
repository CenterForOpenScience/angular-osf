import { TagSeverityType } from './severity.type';

export interface StatusInfo {
  label: string;
  severity: TagSeverityType | null;
}
