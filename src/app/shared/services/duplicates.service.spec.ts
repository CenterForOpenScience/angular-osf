import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { CurrentResourceType } from '@osf/shared/enums/resource-type.enum';
import { BaseNodeMapper } from '@osf/shared/mappers/nodes';
import { NodeModel } from '@osf/shared/models/nodes/base-node.model';
import { NodesResponseJsonApi } from '@osf/shared/models/nodes/nodes-json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { DuplicatesService } from './duplicates.service';
import { JsonApiService } from './json-api.service';

const BASE_GET_PARAMS: Record<string, unknown> = {
  embed: 'bibliographic_contributors',
  'fields[users]': 'family_name,full_name,given_name,middle_name',
};

function getDuplicatesApiResponse(): NodesResponseJsonApi {
  return {
    data: [],
    links: {},
    meta: {
      total: 1,
      per_page: 10,
      version: '2.0',
    },
  };
}

describe('DuplicatesService', () => {
  let service: DuplicatesService;
  let jsonApiService: JsonApiServiceMockType;

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [DuplicatesService, MockProvider(JsonApiService, jsonApiService), provideMockEnvironment()],
    });

    service = TestBed.inject(DuplicatesService);
  }

  it('should expose apiUrl from environment', () => {
    setup();
    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('fetchAllDuplicates should request forks and map response', async () => {
    setup();
    const mapped: PaginatedData<NodeModel[]> = {
      data: [MOCK_NODE_WITH_ADMIN],
      totalCount: 1,
      pageSize: 10,
    };
    const mapperSpy = vi.spyOn(BaseNodeMapper, 'getNodesWithEmbedsAndTotalData').mockReturnValue(mapped);
    const apiResponse = getDuplicatesApiResponse();
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.fetchAllDuplicates('node-1', CurrentResourceType.Projects));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/node-1/forks/`, BASE_GET_PARAMS);
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(mapped);
  });

  it('fetchAllDuplicates should include page and page size when provided', async () => {
    setup();
    jsonApiService.get.mockReturnValue(of(getDuplicatesApiResponse()));

    await firstValueFrom(service.fetchAllDuplicates('reg-1', CurrentResourceType.Registrations, 2, 25));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/registrations/reg-1/forks/`, {
      ...BASE_GET_PARAMS,
      page: 2,
      'page[size]': 25,
    });
  });

  it('forkResource should POST forks payload with projects type', async () => {
    setup();
    jsonApiService.post.mockReturnValue(of(undefined));

    await firstValueFrom(service.forkResource('node-1', CurrentResourceType.Projects));

    expect(jsonApiService.post).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/node-1/forks/`, {
      data: { type: CurrentResourceType.Projects },
    });
  });

  it('forkResource should POST to registrations forks with projects type payload', async () => {
    setup();
    jsonApiService.post.mockReturnValue(of(undefined));

    await firstValueFrom(service.forkResource('reg-1', CurrentResourceType.Registrations));

    expect(jsonApiService.post).toHaveBeenCalledWith(`${MOCK_API_URL}/registrations/reg-1/forks/`, {
      data: { type: CurrentResourceType.Projects },
    });
  });
});
