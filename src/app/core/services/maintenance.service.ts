import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Maintenance, MaintenanceSeverity } from '../models/maintenance.model';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiDomainUrl}/v2`;

  fetchMaintenanceStatus(): Observable<Maintenance | null> {
    return this.http.get<{ maintenance?: Maintenance }>(`${this.apiUrl}/status/`).pipe(
      map((data) => {
        const maintenance = data.maintenance;
        if (maintenance && this.isWithinMaintenanceWindow(maintenance)) {
          return { ...maintenance, severity: this.getSeverity(maintenance.level) };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  getSeverity(level: number): MaintenanceSeverity {
    const map: Record<number, MaintenanceSeverity> = { 1: 'info', 2: 'warn', 3: 'error' };
    return map[level] ?? 'info';
  }

  private isWithinMaintenanceWindow(maintenance: Maintenance): boolean {
    if (!maintenance.start || !maintenance.end) return false;
    const now = new Date();
    return now >= new Date(maintenance.start) && now <= new Date(maintenance.end);
  }
}
