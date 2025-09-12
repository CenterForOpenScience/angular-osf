import { provideStore, Store } from '@ngxs/store';

import { TestBed } from '@angular/core/testing';

import { ActivityLogsSelectors } from './activity-logs.selectors';
import { ActivityLogsState } from './activity-logs.state';

describe.skip('ActivityLogsSelectors', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([ActivityLogsState])],
    });
    store = TestBed.inject(Store);
  });

  it('selects logs, formatted logs, totalCount, and loading', () => {
    store.reset({
      activityLogs: {
        activityLogs: {
          data: [{ id: '1', date: '2024-01-01T00:00:00Z', formattedActivity: 'FMT' }],
          isLoading: false,
          error: null,
          totalCount: 1,
        },
      },
    } as any);

    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogs).length).toBe(1);
    expect(store.selectSnapshot(ActivityLogsSelectors.getFormattedActivityLogs)[0].formattedActivity).toBe('FMT');
    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsTotalCount)).toBe(1);
    expect(store.selectSnapshot(ActivityLogsSelectors.getActivityLogsLoading)).toBe(false);
  });
});
