import { provideStore, Store } from '@ngxs/store';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { ActivityLogDisplayService } from '@shared/services';

import { ClearActivityLogsStore, GetRegistrationActivityLogs } from './activity-logs.actions';
import { ActivityLogsState } from './activity-logs.state';

import { getActivityLogsResponse } from '@testing/data/activity-logs/activity-logs.data';
import { environment } from 'src/environments/environment';

describe('State: ActivityLogs', () => {
  let store: Store;

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

      // loading true
      expect(store.selectSnapshot((s: any) => s.activityLogs.activityLogs.isLoading)).toBe(true);

      const req = httpMock.expectOne(
        (r) => r.method === 'GET' && r.url === `${environment.apiUrl}/registrations/reg123/logs/`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('page[size]')).toBe('10');

      req.flush(getActivityLogsResponse());

      expect(snapshot.isLoading).toBe(false);
      expect(snapshot.totalCount).toBe(2);
      expect(snapshot.data[0].formattedActivity).toContain('formatted');

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
