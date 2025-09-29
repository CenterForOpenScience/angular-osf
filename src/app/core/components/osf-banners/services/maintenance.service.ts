import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { ENVIRONMENT } from '@core/provider/environment.provider';

import { MaintenanceModel, MaintenanceSeverityType } from '../models/maintenance.model';

/**
 * `MaintenanceService` is responsible for retrieving the current maintenance status from the backend API.
 *
 * It transforms raw API responses into structured `MaintenanceModel` objects and adds computed severity levels.
 * If the current time is outside the declared maintenance window, the service returns `null`.
 */
@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  /** Injected Angular `HttpClient` for making API requests. */
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  get apiUrl() {
    return `${this.environment.apiDomainUrl}/v2`;
  }

  /**
   * Fetches the maintenance status from the API and transforms the response.
   *
   * If a maintenance window is active and properly defined, the method adds a `severity` key to the response.
   * Otherwise, it returns `null`. In case of an error (e.g., network failure), it gracefully returns `null`.
   *
   * @returns An observable emitting the active `MaintenanceModel` or `null` if none or on error.
   */
  fetchMaintenanceStatus(): Observable<MaintenanceModel | null> {
    return this.http.get<{ maintenance?: MaintenanceModel }>(`${this.apiUrl}/status/`).pipe(
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

  /**
   * Converts a numeric maintenance level (1–3) to a user-friendly severity string.
   *
   * @param level - The raw numeric severity level from the backend (1 = info, 2 = warn, 3 = error)
   * @returns A mapped string-based severity level used in the UI
   */
  private getSeverity(level: number): MaintenanceSeverityType {
    const map: Record<number, MaintenanceSeverityType> = { 1: 'info', 2: 'warn', 3: 'error' };
    return map[level] ?? 'info';
  }

  /**
   * Checks whether the current time falls within the declared maintenance window.
   *
   * @param maintenance - The maintenance object containing `start` and `end` date strings
   * @returns `true` if now is between the start and end, otherwise `false`
   */
  private isWithinMaintenanceWindow(maintenance: MaintenanceModel): boolean {
    if (!maintenance.start || !maintenance.end) return false;
    const now = new Date();
    return now >= new Date(maintenance.start) && now <= new Date(maintenance.end);
  }
}
