import { provideStore, Store } from '@ngxs/store';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ActivityLogDisplayService } from '@osf/shared/services/activity-logs/activity-log-display.service';

import { ActivityLogsSelectors } from './activity-logs.selectors';
import { ActivityLogsState } from './activity-logs.state';

import {
  makeActivityLogWithDisplay,
  MOCK_ACTIVITY_LOGS_WITH_DISPLAY,
} from '@testing/mocks/activity-log-with-display.mock';

describe('ActivityLogsSelectors', () => {
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

  it('selects activity logs', () => {
    store.reset({
      activityLogs: {
        activityLogs: {
          data: MOCK_ACTIVITY_LOGS_WITH_DISPLAY,
          isLoading: false,
          error: null,
          totalCount: 2,
        },
      },
    } as any);

    const logs = store.selectSnapshot(ActivityLogsSelectors.getActivityLogs);
    expect(logs.length).toBe(2);
    expect(logs).toEqual(MOCK_ACTIVITY_LOGS_WITH_DISPLAY);
    expect(logs[0].formattedActivity).toBe('Test activity 1');
    expect(logs[1].formattedActivity).toBe('Test activity 2');
  });

  it('selects total count', () => {
    store.reset({
      activityLogs: {
        activityLogs: {
          data: MOCK_ACTIVITY_LOGS_WITH_DISPLAY,
          isLoading: false,
          error: null,
          totalCount: 10,
        },
      },
    } as any);

    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsTotalCount)).toBe(10);
  });

  it('selects loading state', () => {
    store.reset({
      activityLogs: {
        activityLogs: {
          data: [],
          isLoading: true,
          error: null,
          totalCount: 0,
        },
      },
    } as any);

    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsLoading)).toBe(true);
  });

  it('selects empty activity logs', () => {
    store.reset({
      activityLogs: {
        activityLogs: {
          data: [],
          isLoading: false,
          error: null,
          totalCount: 0,
        },
      },
    } as any);

    const logs = store.selectSnapshot(ActivityLogsSelectors.getActivityLogs);
    expect(logs.length).toBe(0);
    expect(logs).toEqual([]);
    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsTotalCount)).toBe(0);
    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsLoading)).toBe(false);
  });

  it('selects activity logs with different states', () => {
    const customLog = makeActivityLogWithDisplay({ id: 'custom-log', action: 'delete' });
    store.reset({
      activityLogs: {
        activityLogs: {
          data: [customLog],
          isLoading: false,
          error: null,
          totalCount: 1,
        },
      },
    } as any);

    const logs = store.selectSnapshot(ActivityLogsSelectors.getActivityLogs);
    expect(logs.length).toBe(1);
    expect(logs[0].id).toBe('custom-log');
    expect(logs[0].action).toBe('delete');
  });
});
