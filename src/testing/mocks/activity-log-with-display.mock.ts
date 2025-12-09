import { ActivityLogWithDisplay } from '@osf/shared/models/activity-logs/activity-log-with-display.model';

import structuredClone from 'structured-clone';

export function makeActivityLogWithDisplay(overrides: Partial<ActivityLogWithDisplay> = {}): ActivityLogWithDisplay {
  return structuredClone({
    id: 'log1',
    type: 'logs',
    action: 'update',
    date: '2024-01-01T00:00:00Z',
    params: {
      contributors: [],
      paramsNode: { id: 'node1', title: 'Test Node' },
      paramsProject: null,
      pointer: null,
    },
    formattedActivity: 'Test activity',
    ...overrides,
  });
}

export const MOCK_ACTIVITY_LOGS_WITH_DISPLAY: ActivityLogWithDisplay[] = [
  makeActivityLogWithDisplay({
    id: 'log1',
    action: 'update',
    date: '2024-01-01T00:00:00Z',
    formattedActivity: 'Test activity 1',
  }),
  makeActivityLogWithDisplay({
    id: 'log2',
    action: 'create',
    date: '2024-01-02T00:00:00Z',
    params: {
      contributors: [],
      paramsNode: { id: 'node2', title: 'Test Node 2' },
      paramsProject: null,
      pointer: null,
    },
    formattedActivity: 'Test activity 2',
  }),
];
