import { CookieService } from 'ngx-cookie-service';

import { MessageModule } from 'primeng/message';

import { filter } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'osf-maintenance-banner',
  imports: [CommonModule, MessageModule],
  templateUrl: './maintenance-banner.component.html',
  styleUrl: './maintenance-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceBannerComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cookies = inject(CookieService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  dismissed = false;
  readonly cookieName = 'osf-maintenance-dismissed';
  readonly cookieDurationHours = 24;

  maintenance: { severity: 'info' | 'warn' | 'error'; text: string } | null = null;

  ngOnInit(): void {
    this.dismissed = this.cookies.check(this.cookieName);

    if (!this.dismissed) {
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        this.fetchMaintenanceStatus();
      });

      this.fetchMaintenanceStatus();
    }
  }

  private isWithinMaintenanceWindow(maintenance: { start: string; end: string }): boolean {
    if (!maintenance.start || !maintenance.end) {
      return false;
    }
    const now = new Date();
    const start = new Date(maintenance.start);
    const end = new Date(maintenance.end);
    return now >= start && now <= end;
  }

  private fetchMaintenanceStatus(): void {
    this.http
      .get<{
        maintenance?: { level: number; message: string; start: string; end: string };
      }>(`${environment.apiUrl}/status/`)
      .subscribe({
        next: (data) => {
          if (data.maintenance && this.isWithinMaintenanceWindow(data.maintenance)) {
            this.maintenance = {
              severity: this.getSeverity(data.maintenance.level),
              text: data.maintenance.message,
            };
            this.cdr.markForCheck();
          } else {
            this.maintenance = null;
            this.cdr.markForCheck();
          }
        },
        error: () => {
          this.maintenance = null;
          this.cdr.markForCheck();
        },
      });
  }

  private getSeverity(level: number): 'info' | 'warn' | 'error' {
    const map: Record<number, 'info' | 'warn' | 'error'> = { 1: 'info', 2: 'warn', 3: 'error' };
    return map[level] ?? 'info';
  }

  dismiss(): void {
    this.cookies.set(this.cookieName, '1', this.cookieDurationHours, '/');
    this.dismissed = true;
    this.maintenance = null;
  }
}
