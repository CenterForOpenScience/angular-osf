import { CookieService } from 'ngx-cookie-service';

import { filter } from 'rxjs/operators';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { environment } from 'src/environments/environment';

interface MaintenanceData {
  level?: number;
  message?: string;
  start?: string;
  end?: string;
}

@Component({
  selector: 'osf-maintenance-banner',
  templateUrl: './maintenance-banner.component.html',
  styleUrl: './maintenance-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class MaintenanceBannerComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly cookies = inject(CookieService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  maintenance: MaintenanceData | null = null;
  dismissed = false;
  readonly cookieName = 'osf-maintenance-dismissed';
  readonly cookieDurationHours = 24;

  ngOnInit(): void {
    this.dismissed = this.cookies.check(this.cookieName);
    if (!this.dismissed) {
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        this.fetchMaintenanceStatus();
      });
      // Initial fetch
      this.fetchMaintenanceStatus();
    }
  }

  private isWithinMaintenanceWindow(maintenance: MaintenanceData): boolean {
    if (!maintenance.start || !maintenance.end) {
      return false;
    }
    const now = new Date();
    const start = new Date(maintenance.start);
    const end = new Date(maintenance.end);
    return now >= start && now <= end;
  }

  private fetchMaintenanceStatus(): void {
    this.http.get<{ maintenance?: MaintenanceData }>(`${environment.apiUrl}/status/`).subscribe({
      next: (data) => {
        if (data && data.maintenance && this.isWithinMaintenanceWindow(data.maintenance)) {
          this.maintenance = data.maintenance;
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

  get alertType(): string {
    const levelMap = ['info', 'warning', 'danger'];
    return this.maintenance?.level ? levelMap[this.maintenance.level - 1] : 'info';
  }

  dismiss(): void {
    this.cookies.set(this.cookieName, '1', this.cookieDurationHours, '/');
    this.dismissed = true;
    this.maintenance = null;
  }
}
