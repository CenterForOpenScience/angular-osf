import { provideStore, Store } from '@ngxs/store';

import { MockProvider } from 'ng-mocks';

import { TestBed } from '@angular/core/testing';

import { ActivityLogDisplayService } from '@osf/shared/services/activity-logs/activity-log-display.service';

import {
  makeActivityLogWithDisplay,
  MOCK_ACTIVITY_LOGS_WITH_DISPLAY,
} from '@testing/mocks/activity-log-with-display.mock';
import { provideOSFHttp } from '@testing/osf.testing.provider';
import { ActivityLogDisplayServiceMock } from '@testing/providers/activity-log-display.service.mock';

import { ActivityLogsStateModel } from './activity-logs.model';
import { ActivityLogsSelectors } from './activity-logs.selectors';
import { ActivityLogsState } from './activity-logs.state';

describe('ActivityLogsSelectors', () => {
  let store: Store;

  const setActivityLogsState = (activityLogsState: ActivityLogsStateModel) => {
    store.reset({
      ...store.snapshot(),
      activityLogs: activityLogsState,
    });
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore([ActivityLogsState]),
        provideOSFHttp(),
        MockProvider(ActivityLogDisplayService, ActivityLogDisplayServiceMock.simple()),
      ],
    });
    store = TestBed.inject(Store);
  });

  it('selects activity logs', () => {
    setActivityLogsState({
      activityLogs: {
        data: MOCK_ACTIVITY_LOGS_WITH_DISPLAY,
        isLoading: false,
        error: null,
        totalCount: 2,
      },
    });

    const logs = store.selectSnapshot(ActivityLogsSelectors.getActivityLogs);
    expect(logs.length).toBe(2);
    expect(logs).toEqual(MOCK_ACTIVITY_LOGS_WITH_DISPLAY);
    expect(logs[0].formattedActivity).toBe('Test activity 1');
    expect(logs[1].formattedActivity).toBe('Test activity 2');
  });

  it('selects total count', () => {
    setActivityLogsState({
      activityLogs: {
        data: MOCK_ACTIVITY_LOGS_WITH_DISPLAY,
        isLoading: false,
        error: null,
        totalCount: 10,
      },
    });

    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsTotalCount)).toBe(10);
  });

  it('selects loading state', () => {
    setActivityLogsState({
      activityLogs: {
        data: [],
        isLoading: true,
        error: null,
        totalCount: 0,
      },
    });

    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsLoading)).toBe(true);
  });

  it('selects empty activity logs', () => {
    setActivityLogsState({
      activityLogs: {
        data: [],
        isLoading: false,
        error: null,
        totalCount: 0,
      },
    });

    const logs = store.selectSnapshot(ActivityLogsSelectors.getActivityLogs);
    expect(logs.length).toBe(0);
    expect(logs).toEqual([]);
    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsTotalCount)).toBe(0);
    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsLoading)).toBe(false);
  });

  it('selects activity logs with different states', () => {
    const customLog = makeActivityLogWithDisplay({ id: 'custom-log', action: 'delete' });
    setActivityLogsState({
      activityLogs: {
        data: [customLog],
        isLoading: false,
        error: null,
        totalCount: 1,
      },
    });

    const logs = store.selectSnapshot(ActivityLogsSelectors.getActivityLogs);
    expect(logs.length).toBe(1);
    expect(logs[0].id).toBe('custom-log');
    expect(logs[0].action).toBe('delete');
  });
});
