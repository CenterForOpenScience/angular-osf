import { ActivityLogWithDisplayModel } from '@osf/shared/models/activity-logs/activity-log-with-display.model';
import { ActivityLogModel } from '@osf/shared/models/activity-logs/activity-logs.model';

export const ACTIVITY_LOGS_EMBEDS_QS =
  'embed%5B%5D=original_node&embed%5B%5D=user&embed%5B%5D=linked_node&embed%5B%5D=linked_registration&embed%5B%5D=template_node';

export function buildRegistrationLogsUrl(registrationId: string, page: number, pageSize: number, apiBase: string) {
  return `${apiBase}/v2/registrations/${registrationId}/logs/?${ACTIVITY_LOGS_EMBEDS_QS}&page=${page}&page%5Bsize%5D=${pageSize}`;
}

export function buildNodeLogsUrl(projectId: string, page: number, pageSize: number, apiBase: string) {
  return `${apiBase}/v2/nodes/${projectId}/logs/?${ACTIVITY_LOGS_EMBEDS_QS}&page=${page}&page%5Bsize%5D=${pageSize}`;
}

type ActivityLogJsonApiOverrides = Record<string, unknown>;

export function makeActivityLogJsonApi(overrides: ActivityLogJsonApiOverrides = {}) {
  return structuredClone({
    id: 'log1',
    type: 'logs',
    attributes: {
      action: 'update',
      date: '2024-01-01T00:00:00Z',
      params: {},
    },
    embeds: {},
    ...overrides,
  });
}

export function makeActivityLogsResponse(logs: ActivityLogJsonApiOverrides[] = [], total?: number) {
  const data = logs.length
    ? logs
    : [
        makeActivityLogJsonApi(),
        makeActivityLogJsonApi({
          id: 'log2',
          attributes: { action: 'create', date: '2024-01-02T00:00:00Z', params: {} },
        }),
      ];

  return structuredClone({
    data,
    meta: {
      total: total ?? data.length,
      anonymous: false,
    },
    included: null,
  });
}

export function getActivityLogsResponse() {
  return makeActivityLogsResponse();
}

export type ActivityLogOverrides = Partial<Omit<ActivityLogModel, 'params'>> & {
  params?: Partial<ActivityLogModel['params']>;
};

export function makeActivityLog(overrides: ActivityLogOverrides = {}): ActivityLogModel {
  const { params: paramsOverrides, ...restOverrides } = overrides;

  return structuredClone({
    id: 'log-1',
    type: 'logs',
    action: 'node_updated',
    date: '2024-01-01T00:00:00Z',
    foreignUser: null,
    params: {
      contributors: [],
      paramsNode: { id: '', title: '' },
      paramsProject: null,
      pointer: null,
      ...paramsOverrides,
    },
    ...restOverrides,
  });
}

export type ActivityLogWithDisplayOverrides = ActivityLogOverrides & {
  formattedActivity?: ActivityLogWithDisplayModel['formattedActivity'];
};

export function makeActivityLogWithDisplay(
  overrides: ActivityLogWithDisplayOverrides = {}
): ActivityLogWithDisplayModel {
  const { params: paramsOverrides, ...restOverrides } = overrides;
  const formattedActivity = 'formattedActivity' in overrides ? overrides.formattedActivity : 'Test activity';

  return {
    ...makeActivityLog({
      id: 'log1',
      action: 'update',
      params: {
        paramsNode: { id: 'node1', title: 'Test Node' },
        ...paramsOverrides,
      },
      ...restOverrides,
    }),
    formattedActivity,
  };
}

export const MOCK_ACTIVITY_LOGS_WITH_DISPLAY: ActivityLogWithDisplayModel[] = [
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
      paramsNode: { id: 'node2', title: 'Test Node 2' },
    },
    formattedActivity: 'Test activity 2',
  }),
];
