import { catchError, map, Observable, of, Subscription, switchMap, timer } from 'rxjs';

import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable, OnDestroy, signal } from '@angular/core';

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
      .subscribe((isMaintenance) => {
        if (!isMaintenance) {
          this.deactivate();
        }
      });
  }

  private stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
  }

  private checkMaintenanceStatus(): Observable<boolean> {
    return this.http
      .get<MaintenanceResponse>(`${this.environment.apiDomainUrl}/v2/`, { context: this.bypassContext })
      .pipe(
        map((response) => response.meta?.maintenance_mode === true),
        catchError(() => of(true))
      );
  }
}
