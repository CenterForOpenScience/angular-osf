import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { ActivityLogDisplayService } from '@shared/services';

import { ActivityLogsService } from './activity-logs.service';

import { getActivityLogsResponse } from '@testing/data/activity-logs/activity-logs.data';
import { OSFTestingStoreModule } from '@testing/osf.testing.module';
import { environment } from 'src/environments/environment';

describe('Service: ActivityLogs', () => {
  let service: ActivityLogsService;

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

    const req = httpMock.expectOne(
      (r) => r.method === 'GET' && r.url === `${environment.apiUrl}/registrations/reg1/logs/`
    );
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

    const req = httpMock.expectOne((r) => r.method === 'GET' && r.url === `${environment.apiUrl}/nodes/proj1/logs/`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('page[size]')).toBe('5');

    req.flush(getActivityLogsResponse());

    expect(result.data.length).toBe(2);
    expect(result.data[1].formattedActivity).toBe('FMT');

    httpMock.verify();
  }));
});
