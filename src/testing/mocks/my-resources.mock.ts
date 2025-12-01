import { MyResourcesItem } from '@shared/models/my-resources/my-resources.models';

import { MOCK_CONTRIBUTOR } from './contributors.mock';

export const MOCK_MY_RESOURCES_ITEM_PROJECT: MyResourcesItem = {
  id: 'project-1',
  type: 'nodes',
  title: 'Test Project',
  dateCreated: '2024-01-01T00:00:00.000Z',
  dateModified: '2024-01-02T00:00:00.000Z',
  isPublic: true,
  contributors: [MOCK_CONTRIBUTOR],
};

export const MOCK_MY_RESOURCES_ITEM_PROJECT_PRIVATE: MyResourcesItem = {
  id: 'project-2',
  type: 'nodes',
  title: 'Private Test Project',
  dateCreated: '2024-01-03T00:00:00.000Z',
  dateModified: '2024-01-04T00:00:00.000Z',
  isPublic: false,
  contributors: [],
};

export const MOCK_MY_RESOURCES_ITEM_REGISTRATION: MyResourcesItem = {
  id: 'registration-1',
  type: 'registrations',
  title: 'Test Registration',
  dateCreated: '2024-01-05T00:00:00.000Z',
  dateModified: '2024-01-06T00:00:00.000Z',
  isPublic: true,
  contributors: [MOCK_CONTRIBUTOR],
};

export const MOCK_MY_RESOURCES_ITEMS: MyResourcesItem[] = [
  MOCK_MY_RESOURCES_ITEM_PROJECT,
  MOCK_MY_RESOURCES_ITEM_PROJECT_PRIVATE,
  MOCK_MY_RESOURCES_ITEM_REGISTRATION,
];
