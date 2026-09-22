import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { MaintenanceResponse } from '@core/models/maintenance-response.model';

import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';

import { MaintenanceModeService } from './maintenance-mode.service';

describe('MaintenanceModeService', () => {
  let service: MaintenanceModeService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8000/v2/';
  const pollIntervalMs = 5 * 60 * 1_000;
  const maintenanceOn: MaintenanceResponse = { meta: { maintenance_mode: true } };
  const maintenanceOff: MaintenanceResponse = { meta: { maintenance_mode: false } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), provideOSFHttp()],
    });
    service = TestBed.inject(MaintenanceModeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    service.ngOnDestroy();
    httpMock.verify();
    vi.useRealTimers();
  });

  function expectStatusRequest(): TestRequest {
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.context.get(BYPASS_ERROR_INTERCEPTOR)).toBe(true);
    return req;
  }

  function flushPoll(response: MaintenanceResponse | null, status = 200): void {
    vi.advanceTimersByTime(0);
    const req = expectStatusRequest();
    if (status === 200) {
      req.flush(response ?? {});
      return;
    }
    req.flush(response, { status, statusText: 'Error' });
  }

  it('should GET /v2/ with the error interceptor bypassed on checkOnce', () => {
    service.checkOnce();
    expectStatusRequest().flush(maintenanceOff);
    expect(service.isActive()).toBe(false);
  });

  it('should activate when /v2/ succeeds with maintenance_mode true', () => {
    service.checkOnce();
    expectStatusRequest().flush(maintenanceOn);
    expect(service.isActive()).toBe(true);
  });

  it('should not activate when /v2/ succeeds without maintenance_mode', () => {
    service.checkOnce();
    expectStatusRequest().flush(maintenanceOff);
    expect(service.isActive()).toBe(false);
  });

  it('should activate when /v2/ returns 503 with maintenance_mode true', () => {
    service.checkOnce();
    expectStatusRequest().flush(maintenanceOn, { status: 503, statusText: 'Service Unavailable' });
    expect(service.isActive()).toBe(true);
  });

  it('should not activate when /v2/ returns 503 without maintenance_mode', () => {
    service.checkOnce();
    expectStatusRequest().flush(null, { status: 503, statusText: 'Service Unavailable' });
    expect(service.isActive()).toBe(false);
  });

  it('should not activate when the /v2/ request fails', () => {
    service.checkOnce();
    expectStatusRequest().error(new ProgressEvent('error'));
    expect(service.isActive()).toBe(false);
  });

  it('should deactivate when a poll receives a successful non-maintenance response', () => {
    vi.useFakeTimers();
    service.activate();
    expect(service.isActive()).toBe(true);
    flushPoll(maintenanceOff);
    expect(service.isActive()).toBe(false);
  });

  it('should stay active when a poll request fails', () => {
    vi.useFakeTimers();
    service.activate();
    flushPoll(null, 502);
    expect(service.isActive()).toBe(true);
  });

  it('should not start a second poll when already active', () => {
    vi.useFakeTimers();
    service.activate();
    service.activate();
    flushPoll(maintenanceOn);
    vi.advanceTimersByTime(pollIntervalMs);
    expectStatusRequest().flush(maintenanceOn);
  });

  it('should stop polling on destroy', () => {
    vi.useFakeTimers();
    service.activate();
    flushPoll(maintenanceOn);
    service.ngOnDestroy();
    vi.advanceTimersByTime(pollIntervalMs);
    httpMock.expectNone(apiUrl);
  });
});
