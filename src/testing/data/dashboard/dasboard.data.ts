import { MyResourcesItem } from '@shared/models';

import structuredClone from 'structured-clone';

const ProjectsMock = {
  data: [
    {
      type: 'my-resources-items',
      id: '1',
      attributes: {
        title: 'Deep Learning for Image Recognition',
        date_created: '2025-01-15T10:30:00Z',
        date_modified: '2025-02-01T14:45:00Z',
        is_public: true,
      },
      relationships: {
        contributors: {
          data: [
            {
              type: 'my-resources-contributors',
              id: 'c1',
            },
          ],
        },
      },
      links: {
        self: 'https://api.staging.osf.io/v1/my-resources-items/1',
      },
    },
  ],
  included: [
    {
      type: 'my-resources-contributors',
      id: 'c1',
      attributes: {
        family_name: 'Smith',
        full_name: 'John Michael Smith',
        given_name: 'John',
        middle_name: 'Michael',
      },
      links: {
        self: 'https://api.staging.osf.io/v1/my-resources-contributors/c1',
      },
    },
  ],
};

export function getProjectsMockData(index?: number, asArray?: boolean) {
  if (index || index === 0) {
    if (asArray) {
      return Object({
        data: [structuredClone(ProjectsMock.data[index])],
      });
    } else {
      return structuredClone({
        data: ProjectsMock.data[index],
      });
    }
  } else {
    return structuredClone(ProjectsMock);
  }
}

export function getProjectsMockForComponent(): MyResourcesItem[] {
  return getProjectsMockData().data.map((item: any) => ({
    id: item.id,
    type: item.type,
    title: item.attributes.title,
    dateCreated: item.attributes.date_created,
    dateModified: item.attributes.date_modified,
    isPublic: item.attributes.is_public,
    contributors: [],
  }));
}
