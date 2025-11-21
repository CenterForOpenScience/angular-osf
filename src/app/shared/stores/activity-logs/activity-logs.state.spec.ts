import { provideStore, Store } from '@ngxs/store';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ActivityLogDisplayService } from '@osf/shared/services/activity-logs/activity-log-display.service';

import { ClearActivityLogs, GetActivityLogs } from './activity-logs.actions';
import { ActivityLogsState } from './activity-logs.state';

import {
  buildNodeLogsUrl,
  buildRegistrationLogsUrl,
  getActivityLogsResponse,
} from '@testing/data/activity-logs/activity-logs.data';
import { EnvironmentTokenMock } from '@testing/mocks/environment.token.mock';

describe('State: ActivityLogs', () => {
  let store: Store;
  const environment = EnvironmentTokenMock;
  const apiBase = environment.useValue.apiDomainUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore([ActivityLogsState]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivityLogDisplayService,
          useValue: { getActivityDisplay: jest.fn().mockReturnValue('<span>formatted</span>') },
        },
      ],
    });

    store = TestBed.inject(Store);
  });

  it('loads registration logs and formats activities', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      let snapshot: any;

      store.dispatch(new GetActivityLogs('reg123', CurrentResourceType.Registrations, 1, 10)).subscribe(() => {
        snapshot = store.snapshot().activityLogs.activityLogs;
      });

      expect(store.selectSnapshot((s: any) => s.activityLogs.activityLogs.isLoading)).toBe(true);

      const fullUrl = buildRegistrationLogsUrl('reg123', 1, 10, apiBase);
      const urlPath = fullUrl.split('?')[0].replace(apiBase, '');
      const req = httpMock.expectOne((request) => {
        return request.url.includes(urlPath) && request.method === 'GET';
      });
      expect(req.request.method).toBe('GET');

      req.flush(getActivityLogsResponse());

      expect(snapshot.isLoading).toBe(false);
      expect(snapshot.totalCount).toBe(2);
      expect(snapshot.data[0].formattedActivity).toContain('formatted');

      httpMock.verify();
    }
  ));

  it('handles error when loading registration logs', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      store.dispatch(new GetActivityLogs('reg500', CurrentResourceType.Registrations, 1, 10)).subscribe();

      expect(store.selectSnapshot((s: any) => s.activityLogs.activityLogs.isLoading)).toBe(true);

      const fullUrl = buildRegistrationLogsUrl('reg500', 1, 10, apiBase);
      const urlPath = fullUrl.split('?')[0].replace(apiBase, '');
      const req = httpMock.expectOne((request) => {
        return request.url.includes(urlPath) && request.method === 'GET';
      });
      req.flush({ errors: [{ detail: 'boom' }] }, { status: 500, statusText: 'Server Error' });

      const snap = store.snapshot().activityLogs.activityLogs;
      expect(snap.isLoading).toBe(false);
      expect(snap.error).toBeTruthy();
      expect(snap.totalCount).toBe(0);

      httpMock.verify();
    }
  ));

  it('loads project logs (nodes) and formats activities', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      let snapshot: any;
      store.dispatch(new GetActivityLogs('proj123', CurrentResourceType.Projects, 1, 10)).subscribe(() => {
        snapshot = store.snapshot().activityLogs.activityLogs;
      });

      expect(store.selectSnapshot((s: any) => s.activityLogs.activityLogs.isLoading)).toBe(true);

      const fullUrl = buildNodeLogsUrl('proj123', 1, 10, apiBase);
      const urlPath = fullUrl.split('?')[0].replace(apiBase, '');
      const req = httpMock.expectOne((request) => {
        return request.url.includes(urlPath) && request.method === 'GET';
      });
      expect(req.request.method).toBe('GET');

      req.flush(getActivityLogsResponse());

      expect(snapshot.isLoading).toBe(false);
      expect(snapshot.totalCount).toBe(2);
      expect(snapshot.data[1].formattedActivity).toContain('formatted');

      httpMock.verify();
    }
  ));

  it('handles error when loading project logs (nodes)', inject(
    [HttpTestingController],
    (httpMock: HttpTestingController) => {
      store.dispatch(new GetActivityLogs('proj500', CurrentResourceType.Projects, 1, 10)).subscribe();

      expect(store.selectSnapshot((s: any) => s.activityLogs.activityLogs.isLoading)).toBe(true);

      const fullUrl = buildNodeLogsUrl('proj500', 1, 10, apiBase);
      const urlPath = fullUrl.split('?')[0].replace(apiBase, '');
      const req = httpMock.expectOne((request) => {
        return request.url.includes(urlPath) && request.method === 'GET';
      });
      req.flush({ errors: [{ detail: 'boom' }] }, { status: 500, statusText: 'Server Error' });

      const snap = store.snapshot().activityLogs.activityLogs;
      expect(snap.isLoading).toBe(false);
      expect(snap.error).toBeTruthy();
      expect(snap.totalCount).toBe(0);

      httpMock.verify();
    }
  ));

  it('clears store', () => {
    store.reset({
      activityLogs: {
        activityLogs: { data: [{ id: 'x' }], isLoading: false, error: null, totalCount: 1 },
      },
    } as any);

    store.dispatch(new ClearActivityLogs());
    const snap = store.snapshot().activityLogs.activityLogs;
    expect(snap.data).toEqual([]);
    expect(snap.totalCount).toBe(0);
  });
});
