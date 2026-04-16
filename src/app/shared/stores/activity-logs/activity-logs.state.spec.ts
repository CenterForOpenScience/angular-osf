import { provideStore, Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { firstValueFrom, Subject, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { CurrentResourceType } from '@shared/enums/resource-type.enum';
import { PaginatedData } from '@shared/models/paginated-data.model';
import { ActivityLogsService } from '@shared/services/activity-logs/activity-logs.service';

import { MOCK_ACTIVITY_LOGS_WITH_DISPLAY } from '@testing/mocks/activity-log-with-display.mock';

import { ClearActivityLogs, GetActivityLogs } from './activity-logs.actions';
import { ACTIVITY_LOGS_STATE_DEFAULT } from './activity-logs.model';
import { ActivityLogsSelectors } from './activity-logs.selectors';
import { ActivityLogsState } from './activity-logs.state';

describe('State: ActivityLogs', () => {
  let store: Store;
  let fetchLogsMock: ReturnType<typeof vi.fn<ActivityLogsService['fetchLogs']>>;

  beforeEach(() => {
    fetchLogsMock = vi.fn();
    const mockActivityLogsService: Pick<ActivityLogsService, 'fetchLogs'> = { fetchLogs: fetchLogsMock };

    TestBed.configureTestingModule({
      providers: [provideStore([ActivityLogsState]), MockProvider(ActivityLogsService, mockActivityLogsService)],
    });

    store = TestBed.inject(Store);
  });

  it('should fetch activity logs and update state', async () => {
    const response: PaginatedData<typeof MOCK_ACTIVITY_LOGS_WITH_DISPLAY> = {
      data: MOCK_ACTIVITY_LOGS_WITH_DISPLAY,
      totalCount: 2,
      pageSize: 10,
    };
    const subject = new Subject<PaginatedData<typeof MOCK_ACTIVITY_LOGS_WITH_DISPLAY>>();
    fetchLogsMock.mockReturnValue(subject.asObservable());

    const dispatchPromise = firstValueFrom(
      store.dispatch(new GetActivityLogs('project-id', CurrentResourceType.Projects, 2, 10))
    );

    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsLoading)).toBe(true);
    expect(fetchLogsMock).toHaveBeenCalledWith(CurrentResourceType.Projects, 'project-id', 2, 10);

    subject.next(response);
    subject.complete();
    await dispatchPromise;

    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogs)).toEqual(MOCK_ACTIVITY_LOGS_WITH_DISPLAY);
    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsTotalCount)).toBe(2);
    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsLoading)).toBe(false);
  });

  it('should handle fetch activity logs error', async () => {
    fetchLogsMock.mockReturnValue(throwError(() => new Error('Failed to fetch logs')));

    await expect(
      firstValueFrom(store.dispatch(new GetActivityLogs('project-id', CurrentResourceType.Projects, 1, 10)))
    ).rejects.toThrow('Failed to fetch logs');

    const snapshot = store.snapshot().activityLogs.activityLogs;
    expect(snapshot.data).toEqual([]);
    expect(snapshot.error).toBe('Failed to fetch logs');
    expect(snapshot.isLoading).toBe(false);
  });

  it('should reset state to defaults after ClearActivityLogs', async () => {
    const response: PaginatedData<typeof MOCK_ACTIVITY_LOGS_WITH_DISPLAY> = {
      data: MOCK_ACTIVITY_LOGS_WITH_DISPLAY,
      totalCount: 2,
      pageSize: 10,
    };
    const subject = new Subject<PaginatedData<typeof MOCK_ACTIVITY_LOGS_WITH_DISPLAY>>();
    fetchLogsMock.mockReturnValue(subject.asObservable());

    const dispatchPromise = firstValueFrom(
      store.dispatch(new GetActivityLogs('project-id', CurrentResourceType.Projects, 1, 10))
    );
    subject.next(response);
    subject.complete();
    await dispatchPromise;

    await firstValueFrom(store.dispatch(new ClearActivityLogs()));

    expect(store.snapshot().activityLogs).toEqual(ACTIVITY_LOGS_STATE_DEFAULT);
  });
});
