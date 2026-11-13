import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { ResourceSearchMode } from '@osf/shared/enums/resource-search-mode.enum';
import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { ResourceVisibilityFilter } from '@osf/shared/enums/resource-visibility-filter.enum';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { MyResourcesMapper } from '@osf/shared/mappers/my-resources.mapper';

import { MOCK_MY_RESOURCES_ITEM_PROJECT } from '@testing/mocks/my-resources.mock';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { MyResourcesResponseJsonApi } from '../models/my-resources/my-resources-json-api.model';

import { JsonApiService } from './json-api.service';
import { MyResourcesService } from './my-resources.service';

const BASE_GET_PARAMS: Record<string, unknown> = {
  'embed[]': ['bibliographic_contributors'],
  'fields[users]': 'family_name,full_name,given_name,middle_name',
};

const RESOURCE_FIELDS = 'title,date_created,date_modified,public,bibliographic_contributors';

function getProjectsApiResponse(): MyResourcesResponseJsonApi {
  return {
    data: [
      {
        id: 'node-1',
        type: CurrentResourceType.Projects,
        attributes: {
          title: 'Test Project',
          date_created: '2024-01-01T00:00:00.000Z',
          date_modified: '2024-01-02T00:00:00.000Z',
          public: true,
        },
        embeds: {
          bibliographic_contributors: {
            data: [],
          },
        },
      },
    ],
    links: {},
    meta: {
      total: 1,
      per_page: 10,
      version: '2.0',
    },
  };
}

function expectedResourceParams(
  resourceType: CurrentResourceType,
  extra: Record<string, unknown> = {}
): Record<string, unknown> {
  const fields = resourceType === CurrentResourceType.Preprints ? `${RESOURCE_FIELDS},is_migrated` : RESOURCE_FIELDS;

  return {
    ...BASE_GET_PARAMS,
    [`fields[${resourceType}]`]: fields,
    ...extra,
  };
}

describe('MyResourcesService', () => {
  let service: MyResourcesService;
  let jsonApiService: JsonApiServiceMockType;

  beforeEach(() => {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [MyResourcesService, MockProvider(JsonApiService, jsonApiService), provideMockEnvironment()],
    });

    service = TestBed.inject(MyResourcesService);
  });

  it('should expose apiUrl from environment', () => {
    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('getMyProjects should request user nodes and map response', async () => {
    const mapperSpy = vi.spyOn(MyResourcesMapper, 'fromResponse').mockReturnValue(MOCK_MY_RESOURCES_ITEM_PROJECT);
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    const response = await firstValueFrom(service.getMyProjects());

    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/users/me/${CurrentResourceType.Projects}/`,
      expectedResourceParams(CurrentResourceType.Projects, { sort: '-date_modified' })
    );
    expect(mapperSpy).toHaveBeenCalled();
    expect(response.data).toEqual([MOCK_MY_RESOURCES_ITEM_PROJECT]);
  });

  it('getMyProjects should include search, pagination, and sort params', async () => {
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(
      service.getMyProjects(
        {
          searchValue: 'alpha',
          searchFields: ['title', 'description'],
          sortColumn: 'title',
          sortOrder: SortOrder.Desc,
        },
        2,
        25
      )
    );

    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/users/me/${CurrentResourceType.Projects}/`,
      expectedResourceParams(CurrentResourceType.Projects, {
        'filter[title,description]': 'alpha',
        page: 2,
        'page[size]': 25,
        sort: '-title',
      })
    );
  });

  it('getMyProjects should request public nodes without sort for All search mode', async () => {
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(service.getMyProjects(undefined, 1, 10, ResourceSearchMode.All));

    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/${CurrentResourceType.Projects}/`,
      expectedResourceParams(CurrentResourceType.Projects, {
        page: 1,
        'page[size]': 10,
      })
    );
    expect(jsonApiService.get.mock.calls[0][1]).not.toHaveProperty('sort');
  });

  it('getMyProjects should apply parent filters for Root and Component search modes', async () => {
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(service.getMyProjects(undefined, 1, 10, ResourceSearchMode.Root));
    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/users/me/${CurrentResourceType.Projects}/`,
      expectedResourceParams(CurrentResourceType.Projects, {
        'filter[parent]': null,
        page: 1,
        'page[size]': 10,
        sort: '-date_modified',
      })
    );

    jsonApiService.get.mockClear();
    await firstValueFrom(service.getMyProjects(undefined, 1, 10, ResourceSearchMode.Component));
    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/users/me/${CurrentResourceType.Projects}/`,
      expectedResourceParams(CurrentResourceType.Projects, {
        'filter[parent][ne]': null,
        page: 1,
        'page[size]': 10,
        sort: '-date_modified',
      })
    );
  });

  it('getMyProjects should apply visibility filters', async () => {
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(
      service.getMyProjects(undefined, 1, 10, ResourceSearchMode.User, ResourceVisibilityFilter.Public)
    );
    expect(jsonApiService.get.mock.calls[0][1]).toMatchObject({ 'filter[public]': true });

    jsonApiService.get.mockClear();
    await firstValueFrom(
      service.getMyProjects(undefined, 1, 10, ResourceSearchMode.User, ResourceVisibilityFilter.Private)
    );
    expect(jsonApiService.get.mock.calls[0][1]).toMatchObject({ 'filter[public]': false });

    jsonApiService.get.mockClear();
    await firstValueFrom(
      service.getMyProjects(undefined, 1, 10, ResourceSearchMode.User, ResourceVisibilityFilter.All)
    );
    expect(jsonApiService.get.mock.calls[0][1]).not.toHaveProperty('filter[public]');
  });

  it('getMyRegistrations and getMyPreprints should request matching endpoints and fields', async () => {
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(service.getMyRegistrations(undefined, 1, 10));
    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/users/me/${CurrentResourceType.Registrations}/`,
      expectedResourceParams(CurrentResourceType.Registrations, {
        page: 1,
        'page[size]': 10,
        sort: '-date_modified',
      })
    );

    jsonApiService.get.mockClear();
    await firstValueFrom(service.getMyPreprints(undefined, 1, 10));
    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/users/me/${CurrentResourceType.Preprints}/`,
      expectedResourceParams(CurrentResourceType.Preprints, {
        page: 1,
        'page[size]': 10,
        sort: '-date_modified',
      })
    );
  });

  it('createProject should post project payload and map response', async () => {
    const mapperSpy = vi.spyOn(MyResourcesMapper, 'fromResponse').mockReturnValue(MOCK_MY_RESOURCES_ITEM_PROJECT);
    jsonApiService.post.mockReturnValue(
      of({
        data: getProjectsApiResponse().data[0],
      })
    );

    const result = await firstValueFrom(
      service.createProject('New Project', 'Description', 'template-id', 'us', ['inst-1'])
    );

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/${CurrentResourceType.Projects}/`,
      {
        data: {
          type: CurrentResourceType.Projects,
          attributes: {
            title: 'New Project',
            description: 'Description',
            category: 'project',
            template_from: 'template-id',
            public: false,
          },
          relationships: {
            region: {
              data: {
                type: 'regions',
                id: 'us',
              },
            },
            affiliated_institutions: {
              data: [{ type: 'institutions', id: 'inst-1' }],
            },
          },
        },
      },
      {
        'embed[]': ['bibliographic_contributors'],
        [`fields[${CurrentResourceType.Projects}]`]: 'title,date_modified,public,bibliographic_contributors',
        'fields[users]': 'family_name,full_name,given_name,middle_name',
      }
    );
    expect(mapperSpy).toHaveBeenCalled();
    expect(result).toEqual(MOCK_MY_RESOURCES_ITEM_PROJECT);
  });

  it('createProject should omit optional fields when not provided', async () => {
    vi.spyOn(MyResourcesMapper, 'fromResponse').mockReturnValue(MOCK_MY_RESOURCES_ITEM_PROJECT);
    jsonApiService.post.mockReturnValue(
      of({
        data: getProjectsApiResponse().data[0],
      })
    );

    await firstValueFrom(service.createProject('New Project', '', '', 'us', []));

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/${CurrentResourceType.Projects}/`,
      {
        data: {
          type: CurrentResourceType.Projects,
          attributes: {
            title: 'New Project',
            category: 'project',
            public: false,
          },
          relationships: {
            region: {
              data: {
                type: 'regions',
                id: 'us',
              },
            },
          },
        },
      },
      expect.any(Object)
    );
  });
});
