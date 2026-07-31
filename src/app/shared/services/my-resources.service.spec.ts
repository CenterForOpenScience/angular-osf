import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT } from '@core/provider/environment.provider';
import { ResourceSearchMode } from '@osf/shared/enums/resource-search-mode.enum';
import { ResourceVisibilityFilter } from '@osf/shared/enums/resource-visibility-filter.enum';
import { SortOrder } from '@osf/shared/enums/sort-order.enum';
import { MyResourcesMapper } from '@osf/shared/mappers/my-resources.mapper';
import { MyResourcesResponseJsonApi } from '@osf/shared/models/my-resources/my-resources.model';

import { MOCK_MY_RESOURCES_ITEM_PROJECT } from '@testing/mocks/my-resources.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { JsonApiService } from './json-api.service';
import { MyResourcesService } from './my-resources.service';

const API_URL = 'https://api.test/v2';

const BASE_GET_PARAMS: Record<string, unknown> = {
  'embed[]': ['bibliographic_contributors'],
  'fields[users]': 'family_name,full_name,given_name,middle_name',
};

function getProjectsApiResponse(): MyResourcesResponseJsonApi {
  return {
    data: [
      {
        id: 'node-1',
        type: 'nodes',
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

describe('MyResourcesService', () => {
  let service: MyResourcesService;
  let jsonApiService: JsonApiServiceMockType;

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [
        MyResourcesService,
        MockProvider(JsonApiService, jsonApiService),
        MockProvider(ENVIRONMENT, {
          apiDomainUrl: 'https://api.test',
        }),
      ],
    });

    service = TestBed.inject(MyResourcesService);
  }

  it('should expose apiUrl from environment', () => {
    setup();
    expect(service.apiUrl).toBe(API_URL);
  });

  it('getMyProjects should request user nodes and map response', async () => {
    setup();
    const mapperSpy = vi.spyOn(MyResourcesMapper, 'fromResponse').mockReturnValue(MOCK_MY_RESOURCES_ITEM_PROJECT);
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    const response = await firstValueFrom(service.getMyProjects());

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/users/me/nodes/`, {
      ...BASE_GET_PARAMS,
      'fields[nodes]': 'title,date_created,date_modified,public,bibliographic_contributors',
      sort: '-date_modified',
    });
    expect(mapperSpy).toHaveBeenCalled();
    expect(response.data).toEqual([MOCK_MY_RESOURCES_ITEM_PROJECT]);
    expect(response.meta.total).toBe(1);
  });

  it('getMyProjects should include search, pagination, and sort params', async () => {
    setup();
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

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/users/me/nodes/`, {
      ...BASE_GET_PARAMS,
      'fields[nodes]': 'title,date_created,date_modified,public,bibliographic_contributors',
      'filter[title,description]': 'alpha',
      page: 2,
      'page[size]': 25,
      sort: '-title',
    });
  });

  it('getMyProjects should request public nodes endpoint when search mode is All', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(service.getMyProjects(undefined, 1, 10, ResourceSearchMode.All));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/nodes/`, {
      ...BASE_GET_PARAMS,
      'fields[nodes]': 'title,date_created,date_modified,public,bibliographic_contributors',
      page: 1,
      'page[size]': 10,
    });
    expect(jsonApiService.get.mock.calls[0][1]).not.toHaveProperty('sort');
  });

  it('getMyProjects should add root project filter when rootProjectId is provided', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(service.getMyProjects(undefined, 1, 10, ResourceSearchMode.User, 'root-id'));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/users/me/nodes/`, {
      ...BASE_GET_PARAMS,
      'fields[nodes]': 'title,date_created,date_modified,public,bibliographic_contributors',
      'filter[root][ne]': 'root-id',
      page: 1,
      'page[size]': 10,
      sort: '-date_modified',
    });
  });

  it('getMyProjects should add parent filter for Root search mode', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(service.getMyProjects(undefined, 1, 10, ResourceSearchMode.Root));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/users/me/nodes/`, {
      ...BASE_GET_PARAMS,
      'fields[nodes]': 'title,date_created,date_modified,public,bibliographic_contributors',
      'filter[parent]': null,
      page: 1,
      'page[size]': 10,
      sort: '-date_modified',
    });
  });

  it('getMyProjects should add parent filter for Component search mode', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(service.getMyProjects(undefined, 1, 10, ResourceSearchMode.Component));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/users/me/nodes/`, {
      ...BASE_GET_PARAMS,
      'fields[nodes]': 'title,date_created,date_modified,public,bibliographic_contributors',
      'filter[parent][ne]': null,
      page: 1,
      'page[size]': 10,
      sort: '-date_modified',
    });
  });

  it('getMyProjects should add public visibility filter when visibility is Public', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(
      service.getMyProjects(undefined, 1, 10, ResourceSearchMode.User, undefined, ResourceVisibilityFilter.Public)
    );

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/users/me/nodes/`, {
      ...BASE_GET_PARAMS,
      'fields[nodes]': 'title,date_created,date_modified,public,bibliographic_contributors',
      'filter[public]': true,
      page: 1,
      'page[size]': 10,
      sort: '-date_modified',
    });
  });

  it('getMyProjects should add private visibility filter when visibility is Private', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(
      service.getMyProjects(undefined, 1, 10, ResourceSearchMode.User, undefined, ResourceVisibilityFilter.Private)
    );

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/users/me/nodes/`, {
      ...BASE_GET_PARAMS,
      'fields[nodes]': 'title,date_created,date_modified,public,bibliographic_contributors',
      'filter[public]': false,
      page: 1,
      'page[size]': 10,
      sort: '-date_modified',
    });
  });

  it('getMyProjects should not add visibility filter when visibility is All', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(
      service.getMyProjects(undefined, 1, 10, ResourceSearchMode.User, undefined, ResourceVisibilityFilter.All)
    );

    expect(jsonApiService.get.mock.calls[0][1]).not.toHaveProperty('filter[public]');
  });

  it('getMyRegistrations should request user registrations endpoint', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(service.getMyRegistrations(undefined, 1, 10));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/users/me/registrations/`, {
      ...BASE_GET_PARAMS,
      'fields[registrations]': 'title,date_created,date_modified,public,bibliographic_contributors',
      page: 1,
      'page[size]': 10,
      sort: '-date_modified',
    });
  });

  it('getMyPreprints should request user preprints endpoint', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getProjectsApiResponse()));

    await firstValueFrom(service.getMyPreprints(undefined, 1, 10));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${API_URL}/users/me/preprints/`, {
      ...BASE_GET_PARAMS,
      'fields[preprints]': 'title,date_created,date_modified,public,bibliographic_contributors',
      page: 1,
      'page[size]': 10,
      sort: '-date_modified',
    });
  });

  it('createProject should post project payload and map response', async () => {
    setup();
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
      `${API_URL}/nodes/`,
      {
        data: {
          type: 'nodes',
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
        'fields[nodes]': 'title,date_modified,public,bibliographic_contributors',
        'fields[users]': 'family_name,full_name,given_name,middle_name',
      }
    );
    expect(mapperSpy).toHaveBeenCalled();
    expect(result).toEqual(MOCK_MY_RESOURCES_ITEM_PROJECT);
  });

  it('createProject should omit optional fields when not provided', async () => {
    setup();
    vi.spyOn(MyResourcesMapper, 'fromResponse').mockReturnValue(MOCK_MY_RESOURCES_ITEM_PROJECT);
    jsonApiService.post.mockReturnValue(
      of({
        data: getProjectsApiResponse().data[0],
      })
    );

    await firstValueFrom(service.createProject('New Project', '', '', 'us', []));

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${API_URL}/nodes/`,
      {
        data: {
          type: 'nodes',
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
