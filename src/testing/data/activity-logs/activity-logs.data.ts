import { environment } from 'src/environments/environment';
import structuredClone from 'structured-clone';

export const ACTIVITY_LOGS_EMBEDS_QS =
  'embed%5B%5D=original_node&embed%5B%5D=user&embed%5B%5D=linked_node&embed%5B%5D=linked_registration&embed%5B%5D=template_node&embed%5B%5D=group';

export function buildRegistrationLogsUrl(
  registrationId: string,
  page: number,
  pageSize: number,
  apiBase = environment.apiDomainUrl
) {
  return `${apiBase}/v2/registrations/${registrationId}/logs/?${ACTIVITY_LOGS_EMBEDS_QS}&page=${page}&page%5Bsize%5D=${pageSize}`;
}

export function buildNodeLogsUrl(
  projectId: string,
  page: number,
  pageSize: number,
  apiBase = environment.apiDomainUrl
) {
  return `${apiBase}/v2/nodes/${projectId}/logs/?${ACTIVITY_LOGS_EMBEDS_QS}&page=${page}&page%5Bsize%5D=${pageSize}`;
}

type AnyObj = Record<string, any>;

export function makeActivityLog(overrides: AnyObj = {}) {
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

export function makeActivityLogsResponse(logs: AnyObj[] = [], total?: number) {
  const data = logs.length
    ? logs
    : [
        makeActivityLog(),
        makeActivityLog({
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
