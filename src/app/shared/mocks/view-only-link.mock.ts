import { ViewOnlyLinkComponentItem } from '@osf/features/project/contributors/models';
import { PaginatedViewOnlyLinksModel, ViewOnlyLinkModel } from '@osf/shared/models';

export const MOCK_VIEW_ONLY_LINK: ViewOnlyLinkModel = {
  id: 'test-link-1',
  dateCreated: '2024-01-15T10:30:00Z',
  key: 'abc123',
  name: 'Test View Only Link',
  link: 'https://osf.io/test-link/',
  creator: {
    id: 'user-1',
    fullName: 'Test User',
  },
  nodes: [
    {
      id: 'node-1',
      title: 'Test Project',
      category: 'project',
    },
  ],
  anonymous: false,
};

export const MOCK_VIEW_ONLY_LINK_COMPONENT_ITEM: ViewOnlyLinkComponentItem = {
  id: 'test-id',
  title: 'Test Component',
  isCurrentResource: false,
  disabled: false,
  checked: false,
  parentId: null,
};

export const MOCK_PAGINATED_VIEW_ONLY_LINKS: PaginatedViewOnlyLinksModel = {
  items: [MOCK_VIEW_ONLY_LINK],
  total: 1,
  perPage: 10,
  next: null,
  prev: null,
};
