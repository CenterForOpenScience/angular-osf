export interface Maintenance {
  level: number;
  message: string;
  start: string;
  end: string;
  severity?: MaintenanceSeverity;
}

export type MaintenanceSeverity = 'info' | 'warn' | 'error';
