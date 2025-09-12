import { ViewOnlyLinkComponentItem } from '@osf/features/project/contributors/models';
import { PaginatedViewOnlyLinksModel } from '@shared/models';

export const MOCK_VIEW_ONLY_LINK_COMPONENT_ITEM: ViewOnlyLinkComponentItem = {
  id: 'test-id',
  title: 'Test Component',
  isCurrentResource: false,
  disabled: false,
  checked: false,
  parentId: null,
};

export const MOCK_VIEW_ONLY_LINKS = [
  {
    id: 'link-1',
    dateCreated: '2023-01-01',
    key: 'test-key',
    name: 'Test Link',
    link: 'https://test.com',
    creator: { id: 'user-1', fullName: 'John Doe' },
    nodes: [{ id: 'node-1', title: 'Test Node', category: 'project' }],
    anonymous: false,
  },
];

export const MOCK_PAGINATED_VIEW_ONLY_LINKS: PaginatedViewOnlyLinksModel = {
  items: MOCK_VIEW_ONLY_LINKS,
  total: MOCK_VIEW_ONLY_LINKS.length,
  perPage: 10,
  next: null,
  prev: null,
};
