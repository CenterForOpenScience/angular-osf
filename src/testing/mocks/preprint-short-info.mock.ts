import { PreprintShortInfo } from '@osf/features/preprints/models';

export const PREPRINT_SHORT_INFO_ARRAY_MOCK: PreprintShortInfo[] = [
  {
    id: 'preprint-1',
    title: 'Test Preprint 1',
    dateModified: '2024-01-01T00:00:00Z',
    contributors: [
      {
        id: 'user-1',
        name: 'John Doe',
      },
    ],
    providerId: 'provider-1',
  },
  {
    id: 'preprint-2',
    title: 'Test Preprint 2',
    dateModified: '2024-01-02T00:00:00Z',
    contributors: [
      {
        id: 'user-2',
        name: 'Jane Smith',
      },
      {
        id: 'user-3',
        name: 'Bob Wilson',
      },
    ],
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
    contributors: [
      {
        id: 'user-4',
        name: 'Alice Johnson',
      },
    ],
    providerId: 'provider-3',
  },
  {
    id: 'preprint-5',
    title: 'Test Preprint 5',
    dateModified: '2024-01-05T00:00:00Z',
    contributors: [
      {
        id: 'user-5',
        name: 'Charlie Brown',
      },
      {
        id: 'user-6',
        name: 'Diana Prince',
      },
      {
        id: 'user-7',
        name: 'Eve Adams',
      },
    ],
    providerId: 'provider-2',
  },
];
