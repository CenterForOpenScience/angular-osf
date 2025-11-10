import { NodePreprintModel } from '@osf/shared/models/nodes/node-preprint.model';

export const MOCK_NODE_PREPRINT: NodePreprintModel = {
  id: '1',
  title: 'Test Supplement 1',
  dateCreated: '2024-01-15T10:00:00Z',
  dateModified: '2024-01-20T10:00:00Z',
  datePublished: '2024-01-20T10:00:00Z',
  doi: '10.1234/test1',
  isPreprintOrphan: false,
  isPublished: true,
  url: 'https://example.com/supplement1',
};

export const MOCK_NODE_PREPRINTS: NodePreprintModel[] = [
  MOCK_NODE_PREPRINT,
  {
    id: '2',
    title: 'Test Supplement 2',
    dateCreated: '2024-02-01T10:00:00Z',
    dateModified: '2024-02-05T10:00:00Z',
    datePublished: '2024-02-05T10:00:00Z',
    doi: '10.1234/test2',
    isPreprintOrphan: false,
    isPublished: true,
    url: 'https://example.com/supplement2',
  },
];
