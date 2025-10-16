import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { MaintenanceModel } from '../models/maintenance.model';

import { MaintenanceService } from './maintenance.service';

import { environment } from 'src/environments/environment';

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiDomainUrl}/v2/status/`;

  const futureDate = (offsetMinutes: number) => new Date(Date.now() + offsetMinutes * 60000).toISOString();

  const validMaintenance: MaintenanceModel = {
    start: futureDate(-10),
    end: futureDate(10),
    level: 2,
    message: 'Scheduled maintenance',
  };

  const expiredMaintenance: MaintenanceModel = {
    start: futureDate(-60),
    end: futureDate(-30),
    level: 1,
    message: 'Old maintenance',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MaintenanceService],
    });
    service = TestBed.inject(MaintenanceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return maintenance when within window and map severity correctly', (done) => {
    service.fetchMaintenanceStatus().subscribe((result) => {
      expect(result).toEqual({
        ...validMaintenance,
        severity: 'warn',
      });
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ maintenance: validMaintenance });
    httpMock.verify();
  });

  it('should return null when maintenance is outside window', (done) => {
    service.fetchMaintenanceStatus().subscribe((result) => {
      expect(result).toBeNull();
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush({ maintenance: expiredMaintenance });
    httpMock.verify();
  });

  it('should return null when maintenance is not present', (done) => {
    service.fetchMaintenanceStatus().subscribe((result) => {
      expect(result).toBeNull();
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush({});
    httpMock.verify();
  });

  it('should handle errors and return null', (done) => {
    service.fetchMaintenanceStatus().subscribe((result) => {
      expect(result).toBeNull();
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    req.error(new ProgressEvent('error'));
  });

  it('should map unknown severity level to "info"', () => {
    const result = (service as any).getSeverity(99);
    expect(result).toBe('info');
  });

  it('should return false if start or end is missing', () => {
    const partial: Partial<MaintenanceModel> = { level: 1, message: 'Missing dates' };
    const result = (service as any).isWithinMaintenanceWindow(partial);
    expect(result).toBe(false);
  });
});
