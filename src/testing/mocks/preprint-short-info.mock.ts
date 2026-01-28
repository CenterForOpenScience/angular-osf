import { PreprintShortInfo } from '@osf/features/preprints/models';

import { MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY } from './contributors.mock';

export const PREPRINT_SHORT_INFO_ARRAY_MOCK: PreprintShortInfo[] = [
  {
    id: 'preprint-1',
    title: 'Test Preprint 1',
    dateModified: '2024-01-01T00:00:00Z',
    contributors: [MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY],
    providerId: 'provider-1',
  },
  {
    id: 'preprint-2',
    title: 'Test Preprint 2',
    dateModified: '2024-01-02T00:00:00Z',
    contributors: [MOCK_CONTRIBUTOR, MOCK_CONTRIBUTOR_WITHOUT_HISTORY],
    providerId: 'provider-2',
  },
  {
    id: 'preprint-3',
    title: 'Test Preprint 3',
    dateModified: '2024-01-03T00:00:00Z',
    contributors: [],
    providerId: 'provider-1',
  },
  {
    id: 'preprint-4',
    title: 'Test Preprint 4',
    dateModified: '2024-01-04T00:00:00Z',
    contributors: [MOCK_CONTRIBUTOR],
    providerId: 'provider-3',
  },
  {
    id: 'preprint-5',
    title: 'Test Preprint 5',
    dateModified: '2024-01-05T00:00:00Z',
    contributors: [MOCK_CONTRIBUTOR],
    providerId: 'provider-2',
  },
];
