import { provideStore, Store } from '@ngxs/store';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { ActivityLogDisplayService } from '@shared/services';

import { ClearActivityLogsStore, GetActivityLogs, GetRegistrationActivityLogs } from './activity-logs.actions';
import { ActivityLogsState } from './activity-logs.state';

import {
  buildNodeLogsUrl,
  buildRegistrationLogsUrl,
  getActivityLogsResponse,
} from '@testing/data/activity-logs/activity-logs.data';
import { EnvironmentTokenMock } from '@testing/mocks/environment.token.mock';

describe.skip('State: ActivityLogs', () => {
  let store: Store;
  const environment = EnvironmentTokenMock;

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

      store.dispatch(new GetRegistrationActivityLogs('reg123', 1, 10)).subscribe(() => {
        snapshot = store.snapshot().activityLogs.activityLogs;
      });

      expect(store.selectSnapshot((s: any) => s.activityLogs.activityLogs.isLoading)).toBe(true);

      const req = httpMock.expectOne(buildRegistrationLogsUrl('reg123', 1, 10, environment.useValue.apiDomainUrl));
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
      store.dispatch(new GetRegistrationActivityLogs('reg500', 1, 10)).subscribe();

      expect(store.selectSnapshot((s: any) => s.activityLogs.activityLogs.isLoading)).toBe(true);

      const req = httpMock.expectOne(buildRegistrationLogsUrl('reg500', 1, 10, environment.useValue.apiDomainUrl));
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
      store.dispatch(new GetActivityLogs('proj123', 1, 10)).subscribe(() => {
        snapshot = store.snapshot().activityLogs.activityLogs;
      });

      expect(store.selectSnapshot((s: any) => s.activityLogs.activityLogs.isLoading)).toBe(true);

      const req = httpMock.expectOne(buildNodeLogsUrl('proj123', 1, 10, environment.useValue.apiDomainUrl));
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
      store.dispatch(new GetActivityLogs('proj500', 1, 10)).subscribe();

      expect(store.selectSnapshot((s: any) => s.activityLogs.activityLogs.isLoading)).toBe(true);

      const req = httpMock.expectOne(buildNodeLogsUrl('proj500', 1, 10, environment.useValue.apiDomainUrl));
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

    store.dispatch(new ClearActivityLogsStore());
    const snap = store.snapshot().activityLogs.activityLogs;
    expect(snap.data).toEqual([]);
    expect(snap.totalCount).toBe(0);
  });
});
