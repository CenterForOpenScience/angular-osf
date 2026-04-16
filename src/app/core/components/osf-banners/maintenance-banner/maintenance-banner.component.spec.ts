import { CookieService } from 'ngx-cookie-service';
import { MockProvider } from 'ng-mocks';

import { of } from 'rxjs';

import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideOSFCore } from '@testing/osf.testing.provider';
import { CookieServiceMock, CookieServiceMockType } from '@testing/providers/cookie-service.mock';
import { MaintenanceServiceMock, MaintenanceServiceMockType } from '@testing/providers/maintenance.service.mock';

import { MaintenanceModel } from '../models/maintenance.model';
import { MaintenanceService } from '../services/maintenance.service';

import { MaintenanceBannerComponent } from './maintenance-banner.component';

describe('MaintenanceBannerComponent', () => {
  let fixture: ComponentFixture<MaintenanceBannerComponent>;
  let component: MaintenanceBannerComponent;
  let maintenanceServiceMock: MaintenanceServiceMockType;
  let cookieServiceMock: CookieServiceMockType;

  const activeMaintenance: MaintenanceModel = {
    level: 2,
    severity: 'warn',
    message: 'Scheduled maintenance',
    start: '2026-03-17T10:00:00.000Z',
    end: '2026-03-17T12:00:00.000Z',
  };

  function setup(overrides?: {
    isBrowser?: boolean;
    cookieDismissed?: boolean;
    maintenance?: MaintenanceModel | null;
  }) {
    maintenanceServiceMock = MaintenanceServiceMock.simple();
    cookieServiceMock = CookieServiceMock.simple();
    cookieServiceMock.check.mockReturnValue(overrides?.cookieDismissed ?? false);
    maintenanceServiceMock.fetchMaintenanceStatus.mockReturnValue(of(overrides?.maintenance ?? null));

    TestBed.configureTestingModule({
      imports: [MaintenanceBannerComponent],
      providers: [
        provideOSFCore(),
        MockProvider(MaintenanceService, maintenanceServiceMock),
        MockProvider(CookieService, cookieServiceMock),
        MockProvider(PLATFORM_ID, overrides?.isBrowser === false ? 'server' : 'browser'),
      ],
    });

    fixture = TestBed.createComponent(MaintenanceBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should check dismissal cookie and skip fetch when dismissed in browser', () => {
    setup({ cookieDismissed: true });
    expect(cookieServiceMock.check).toHaveBeenCalledWith('osf-maintenance-dismissed');
    expect(component.dismissed()).toBe(true);
    expect(maintenanceServiceMock.fetchMaintenanceStatus).not.toHaveBeenCalled();
  });

  it('should fetch maintenance when not dismissed in browser', () => {
    setup({ cookieDismissed: false, maintenance: activeMaintenance });
    expect(cookieServiceMock.check).toHaveBeenCalledWith('osf-maintenance-dismissed');
    expect(maintenanceServiceMock.fetchMaintenanceStatus).toHaveBeenCalledTimes(1);
    expect(component.maintenance()).toEqual(activeMaintenance);
  });

  it('should fetch maintenance on server without cookie check', () => {
    setup({ isBrowser: false, maintenance: activeMaintenance });
    expect(cookieServiceMock.check).not.toHaveBeenCalled();
    expect(maintenanceServiceMock.fetchMaintenanceStatus).toHaveBeenCalledTimes(1);
    expect(component.maintenance()).toEqual(activeMaintenance);
  });

  it('should dismiss and persist cookie in browser', () => {
    setup({ maintenance: activeMaintenance });
    component.dismiss();
    expect(cookieServiceMock.set).toHaveBeenCalledWith('osf-maintenance-dismissed', '1', 24, '/');
    expect(component.dismissed()).toBe(true);
    expect(component.maintenance()).toBeNull();
  });

  it('should dismiss without setting cookie on server', () => {
    setup({ isBrowser: false, maintenance: activeMaintenance });
    component.dismiss();
    expect(cookieServiceMock.set).not.toHaveBeenCalled();
    expect(component.dismissed()).toBe(true);
    expect(component.maintenance()).toBeNull();
  });
});
