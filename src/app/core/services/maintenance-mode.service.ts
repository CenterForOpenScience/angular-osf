import { catchError, map, Observable, of, Subscription, switchMap, timer } from 'rxjs';

import { HttpClient, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';

import { MaintenanceStatus } from '@core/enums/maintenance-status.enum';
import { MaintenanceResponse } from '@core/models/maintenance-response.model';
import { ENVIRONMENT } from '@core/provider/environment.provider';

import { BYPASS_ERROR_INTERCEPTOR } from '../interceptors/error-interceptor.tokens';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceModeService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  private readonly POLL_INTERVAL_MS = 5 * 60 * 1_000;
  private readonly _isActive = signal(false);
  private readonly bypassContext = new HttpContext().set(BYPASS_ERROR_INTERCEPTOR, true);

  private pollingSubscription: Subscription | null = null;

  readonly isActive = this._isActive.asReadonly();

  /**
   * Check for maintenance mode upon application startup.
   * If the application is in maintenance mode, activate the service and start polling for when maintenance mode ends.
   */
  checkOnce(): void {
    this.checkMaintenanceStatus().subscribe((status) => {
      if (status === MaintenanceStatus.Active) {
        this.activate();
      }
    });
  }

  activate(): void {
    this._isActive.set(true);
    if (this.pollingSubscription) {
      return;
    }
    this.startPolling();
  }

  deactivate(): void {
    this._isActive.set(false);
    this.stopPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private startPolling(): void {
    this.pollingSubscription = timer(0, this.POLL_INTERVAL_MS)
      .pipe(switchMap(() => this.checkMaintenanceStatus()))
      .subscribe((status) => {
        if (status === MaintenanceStatus.Inactive) {
          this.deactivate();
        }
      });
  }

  private stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
  }

  private checkMaintenanceStatus(): Observable<MaintenanceStatus> {
    return this.http
      .get<MaintenanceResponse>(`${this.environment.apiDomainUrl}/v2/`, { context: this.bypassContext })
      .pipe(
        map((response) =>
          response.meta?.maintenance_mode === true ? MaintenanceStatus.Active : MaintenanceStatus.Inactive
        ),
        catchError((error: HttpErrorResponse) => of(this.statusFromError(error)))
      );
  }

  private statusFromError(error: HttpErrorResponse): MaintenanceStatus {
    const response = error.error as MaintenanceResponse | null;
    return error.status === 503 && response?.meta?.maintenance_mode === true
      ? MaintenanceStatus.Active
      : MaintenanceStatus.Unknown;
  }
}
