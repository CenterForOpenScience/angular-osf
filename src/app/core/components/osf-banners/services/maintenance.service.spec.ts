import { firstValueFrom } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';

import { MaintenanceModel } from '../models/maintenance.model';

import { MaintenanceService } from './maintenance.service';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8000/v2/status/';

  const now = Date.now();
  const activeWindow = {
    start: new Date(now - 10 * 60 * 1000).toISOString(),
    end: new Date(now + 10 * 60 * 1000).toISOString(),
  };
  const expiredWindow = {
    start: new Date(now - 60 * 60 * 1000).toISOString(),
    end: new Date(now - 30 * 60 * 1000).toISOString(),
  };

  const createMaintenance = (level: number, overrides?: Partial<MaintenanceModel>): MaintenanceModel => ({
    level,
    message: 'Scheduled maintenance',
    start: activeWindow.start,
    end: activeWindow.end,
    ...overrides,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), provideOSFHttp()],
    });
    service = TestBed.inject(MaintenanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should return active maintenance with info severity for level 1', async () => {
    const resultPromise = firstValueFrom(service.fetchMaintenanceStatus());
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ maintenance: createMaintenance(1) });
    const result = await resultPromise;
    expect(result).toEqual(expect.objectContaining({ severity: 'info' }));
  });

  it('should return active maintenance with warn severity for level 2', async () => {
    const resultPromise = firstValueFrom(service.fetchMaintenanceStatus());
    const req = httpMock.expectOne(apiUrl);
    req.flush({ maintenance: createMaintenance(2) });
    const result = await resultPromise;
    expect(result).toEqual(expect.objectContaining({ severity: 'warn' }));
  });

  it('should return active maintenance with error severity for level 3', async () => {
    const resultPromise = firstValueFrom(service.fetchMaintenanceStatus());
    const req = httpMock.expectOne(apiUrl);
    req.flush({ maintenance: createMaintenance(3) });
    const result = await resultPromise;
    expect(result).toEqual(expect.objectContaining({ severity: 'error' }));
  });

  it('should return info severity for unknown level', async () => {
    const resultPromise = firstValueFrom(service.fetchMaintenanceStatus());
    const req = httpMock.expectOne(apiUrl);
    req.flush({ maintenance: createMaintenance(99) });
    const result = await resultPromise;
    expect(result).toEqual(expect.objectContaining({ severity: 'info' }));
  });

  it('should return null when maintenance is outside window', async () => {
    const resultPromise = firstValueFrom(service.fetchMaintenanceStatus());
    const req = httpMock.expectOne(apiUrl);
    req.flush({ maintenance: createMaintenance(2, expiredWindow) });
    const result = await resultPromise;
    expect(result).toBeNull();
  });

  it('should return null when maintenance dates are missing', async () => {
    const resultPromise = firstValueFrom(service.fetchMaintenanceStatus());
    const req = httpMock.expectOne(apiUrl);
    req.flush({
      maintenance: {
        level: 2,
        message: 'Scheduled maintenance',
        start: '',
        end: '',
      },
    });
    const result = await resultPromise;
    expect(result).toBeNull();
  });

  it('should return null when maintenance is absent', async () => {
    const resultPromise = firstValueFrom(service.fetchMaintenanceStatus());
    const req = httpMock.expectOne(apiUrl);
    req.flush({});
    const result = await resultPromise;
    expect(result).toBeNull();
  });

  it('should return null when request fails', async () => {
    const resultPromise = firstValueFrom(service.fetchMaintenanceStatus());
    const req = httpMock.expectOne(apiUrl);
    req.error(new ProgressEvent('error'));
    const result = await resultPromise;
    expect(result).toBeNull();
  });
});
