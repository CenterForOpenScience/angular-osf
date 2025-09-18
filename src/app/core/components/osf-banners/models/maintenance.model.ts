export type MaintenanceSeverityType = 'info' | 'warn' | 'error';

export interface MaintenanceModel {
  level: number;
  message: string;
  start: string;
  end: string;
  severity?: MaintenanceSeverityType;
}
