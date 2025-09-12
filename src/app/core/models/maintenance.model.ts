export interface Maintenance {
  level: number;
  message: string;
  start: string;
  end: string;
  severity?: 'info' | 'warn' | 'error';
}

export type MaintenanceSeverity = 'info' | 'warn' | 'error';
