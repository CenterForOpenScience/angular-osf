import structuredClone from 'structured-clone';

export function getActivityLogsResponse() {
  return structuredClone({
    data: [
      {
        id: 'log1',
        type: 'logs',
        attributes: {
          action: 'update',
          date: '2024-01-01T00:00:00Z',
          params: {},
        },
        embeds: {},
      },
      {
        id: 'log2',
        type: 'logs',
        attributes: {
          action: 'create',
          date: '2024-01-02T00:00:00Z',
          params: {},
        },
        embeds: {},
      },
    ],
    meta: {
      total: 2,
      anonymous: false,
    },
    included: null,
  });
}
