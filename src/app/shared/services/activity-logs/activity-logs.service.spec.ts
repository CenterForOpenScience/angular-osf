import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';

import { ActivityLogDisplayService } from './activity-log-display.service';
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
  const apiBase = environment.useValue.apiDomainUrl;

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

  it('fetchLogs for registrations maps + formats', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      let result: any;
      service.fetchLogs(CurrentResourceType.Registrations, 'reg1', 1, 10).subscribe((res) => (result = res));

      const baseUrl = buildRegistrationLogsUrl('reg1', 1, 10, apiBase).split('?')[0];
      const req = httpMock.expectOne((request) => {
        return request.url.startsWith(baseUrl) && request.method === 'GET';
      });
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('page[size]')).toBe('10');
      expect(req.request.params.getAll('embed[]')).toEqual([
        'original_node',
        'user',
        'linked_node',
        'linked_registration',
        'template_node',
      ]);

      req.flush(getActivityLogsResponse());

      expect(result.totalCount).toBe(2);
      expect(result.data[0].formattedActivity).toBe('FMT');

      httpMock.verify();
    }
  ));

  it('fetchLogs for projects maps + formats', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let result: any;
    service.fetchLogs(CurrentResourceType.Projects, 'proj1', 2, 5).subscribe((res) => (result = res));

    const baseUrl = buildNodeLogsUrl('proj1', 2, 5, apiBase).split('?')[0];
    const req = httpMock.expectOne((request) => {
      return request.url.startsWith(baseUrl) && request.method === 'GET';
    });
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('page[size]')).toBe('5');
    expect(req.request.params.getAll('embed[]')).toEqual([
      'original_node',
      'user',
      'linked_node',
      'linked_registration',
      'template_node',
    ]);

    req.flush(getActivityLogsResponse());

    expect(result.data.length).toBe(2);
    expect(result.data[1].formattedActivity).toBe('FMT');

    httpMock.verify();
  }));

  it('fetchLogs for registrations propagates error', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      let errorObj: any;
      service.fetchLogs(CurrentResourceType.Registrations, 'reg2', 1, 10).subscribe({
        next: () => {},
        error: (e) => (errorObj = e),
      });

      const baseUrl = buildRegistrationLogsUrl('reg2', 1, 10, apiBase).split('?')[0];
      const req = httpMock.expectOne((request) => {
        return request.url.startsWith(baseUrl) && request.method === 'GET';
      });
      req.flush({ errors: [{ detail: 'boom' }] }, { status: 500, statusText: 'Server Error' });

      expect(errorObj).toBeTruthy();
      httpMock.verify();
    }
  ));

  it('fetchLogs for projects propagates error', inject([HttpTestingController], (httpMock: HttpTestingController) => {
    let errorObj: any;
    service.fetchLogs(CurrentResourceType.Projects, 'proj500', 1, 10).subscribe({
      next: () => {},
      error: (e) => (errorObj = e),
    });

    const baseUrl = buildNodeLogsUrl('proj500', 1, 10, apiBase).split('?')[0];
    const req = httpMock.expectOne((request) => {
      return request.url.startsWith(baseUrl) && request.method === 'GET';
    });
    req.flush({ errors: [{ detail: 'boom' }] }, { status: 500, statusText: 'Server Error' });

    expect(errorObj).toBeTruthy();
    httpMock.verify();
  }));
});
