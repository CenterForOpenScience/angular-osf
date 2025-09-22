import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { ActivityLogDisplayService } from '@shared/services';

import { ActivityLogsService } from './activity-logs.service';

import {
  buildNodeLogsUrl,
  buildRegistrationLogsUrl,
  getActivityLogsResponse,
} from '@testing/data/activity-logs/activity-logs.data';
import { EnvironmentTokenMock } from '@testing/mocks/environment.token.mock';
import { OSFTestingStoreModule } from '@testing/osf.testing.module';

describe('Service: ActivityLogs', () => {
  let service: ActivityLogsService;
  const environment = EnvironmentTokenMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OSFTestingStoreModule],
      providers: [
        ActivityLogsService,
        { provide: ActivityLogDisplayService, useValue: { getActivityDisplay: jest.fn().mockReturnValue('FMT') } },
      ],
    });
    service = TestBed.inject(ActivityLogsService);
  });

  it('fetchRegistrationLogs maps + formats', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let result: any;
    service.fetchRegistrationLogs('reg1', 1, 10).subscribe((res) => (result = res));

    const req = httpMock.expectOne(buildRegistrationLogsUrl('reg1', 1, 10, environment.useValue.apiDomainUrl));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('1');
    expect(req.request.params.get('page[size]')).toBe('10');

    req.flush(getActivityLogsResponse());

    expect(result.totalCount).toBe(2);
    expect(result.data[0].formattedActivity).toBe('FMT');

    httpMock.verify();
  }));

  it('fetchLogs maps + formats', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let result: any;
    service.fetchLogs('proj1', 2, 5).subscribe((res) => (result = res));

    const req = httpMock.expectOne(buildNodeLogsUrl('proj1', 2, 5, environment.useValue.apiDomainUrl));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('page[size]')).toBe('5');

    req.flush(getActivityLogsResponse());

    expect(result.data.length).toBe(2);
    expect(result.data[1].formattedActivity).toBe('FMT');

    httpMock.verify();
  }));

  it('fetchRegistrationLogs propagates error', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let errorObj: any;
    service.fetchRegistrationLogs('reg2', 1, 10).subscribe({
      next: () => {},
      error: (e) => (errorObj = e),
    });

    const req = httpMock.expectOne(buildRegistrationLogsUrl('reg2', 1, 10, environment.useValue.apiDomainUrl));
    req.flush({ errors: [{ detail: 'boom' }] }, { status: 500, statusText: 'Server Error' });

    expect(errorObj).toBeTruthy();
    httpMock.verify();
  }));

  it('fetchLogs propagates error', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let errorObj: any;
    service.fetchLogs('proj500', 1, 10).subscribe({
      next: () => {},
      error: (e) => (errorObj = e),
    });

    const req = httpMock.expectOne(buildNodeLogsUrl('proj500', 1, 10, environment.useValue.apiDomainUrl));
    req.flush({ errors: [{ detail: 'boom' }] }, { status: 500, statusText: 'Server Error' });

    expect(errorObj).toBeTruthy();
    httpMock.verify();
  }));
});
