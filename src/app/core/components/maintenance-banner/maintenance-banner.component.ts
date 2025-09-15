import { CookieService } from 'ngx-cookie-service';

import { MessageModule } from 'primeng/message';

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { Maintenance } from '../../models/maintenance.model';
import { MaintenanceService } from '../../services/maintenance.service';

@Component({
  selector: 'osf-maintenance-banner',
  imports: [CommonModule, MessageModule],
  templateUrl: './maintenance-banner.component.html',
  styleUrls: ['./maintenance-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceBannerComponent implements OnInit {
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly cookies = inject(CookieService);
  private readonly cdr = inject(ChangeDetectorRef);

  dismissed = false;
  readonly cookieName = 'osf-maintenance-dismissed';
  readonly cookieDurationHours = 24;

  maintenance: Maintenance | null = null;

  ngOnInit(): void {
    this.dismissed = this.cookies.check(this.cookieName);
    if (!this.dismissed) {
      this.fetchMaintenanceStatus();
    }
  }

  private fetchMaintenanceStatus(): void {
    this.maintenanceService.fetchMaintenanceStatus().subscribe((maintenance) => {
      this.maintenance = maintenance;
      this.cdr.markForCheck();
    });
  }

  dismiss(): void {
    this.cookies.set(this.cookieName, '1', this.cookieDurationHours, '/');
    this.dismissed = true;
    this.maintenance = null;
  }
}
