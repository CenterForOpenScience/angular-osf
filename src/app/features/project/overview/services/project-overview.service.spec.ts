import { MockProvider } from 'ng-mocks';

import { firstValueFrom, of } from 'rxjs';

import { HttpContext } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { BYPASS_ERROR_INTERCEPTOR } from '@core/interceptors/error-interceptor.tokens';
import { JSON_API_BULK_HEADERS } from '@osf/shared/constants/json-api-headers.const';
import { IdentifiersMapper } from '@osf/shared/mappers/identifiers.mapper';
import { InstitutionsMapper } from '@osf/shared/mappers/institutions';
import { LicensesMapper } from '@osf/shared/mappers/licenses.mapper';
import { BaseNodeMapper } from '@osf/shared/mappers/nodes';
import { NodePreprintMapper } from '@osf/shared/mappers/nodes/node-preprint.mapper';
import { NodeStorageMapper } from '@osf/shared/mappers/nodes/node-storage.mapper';
import { IdentifiersResponseJsonApi } from '@osf/shared/models/identifiers/identifier-json-api.model';
import { InstitutionsJsonApiResponse } from '@osf/shared/models/institutions/institution-json-api.model';
import { Institution } from '@osf/shared/models/institutions/institutions.model';
import { LicenseResponseJsonApi } from '@osf/shared/models/license/licenses-json-api.model';
import { BaseNodeDataJsonApi } from '@osf/shared/models/nodes/base-node-data-json-api.model';
import { NodePreprintsResponseJsonApi } from '@osf/shared/models/nodes/node-preprint-json-api.model';
import { NodeStorageModel } from '@osf/shared/models/nodes/node-storage.model';
import { NodeResponseJsonApi, NodesResponseJsonApi } from '@osf/shared/models/nodes/nodes-json-api.model';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';
import { JsonApiService } from '@osf/shared/services/json-api.service';
import { LicenseModel } from '@shared/models/license/license.model';

import { MOCK_NODE_WITH_ADMIN } from '@testing/mocks/node.mock';
import { MOCK_NODE_PREPRINTS } from '@testing/mocks/node-preprint.mock';
import {
  MOCK_PROJECT_AFFILIATED_INSTITUTIONS,
  MOCK_PROJECT_IDENTIFIERS,
  MOCK_PROJECT_OVERVIEW,
} from '@testing/mocks/project-overview.mock';
import { MOCK_API_URL, provideMockEnvironment } from '@testing/providers/environment.provider.mock';
import { JsonApiServiceMock, JsonApiServiceMockType } from '@testing/providers/json-api.service.mock';

import { ProjectOverviewMapper } from '../mappers';
import { PrivacyStatusModel } from '../models';

import { ProjectOverviewService } from './project-overview.service';

describe('ProjectOverviewService', () => {
  let service: ProjectOverviewService;
  let jsonApiService: JsonApiServiceMockType;

  const projectId = 'project-1';
  const nodeData = { id: projectId, type: 'nodes' } as BaseNodeDataJsonApi;
  const nodeResponse = { data: nodeData, meta: { anonymous: false } } as NodeResponseJsonApi;

  function setup() {
    jsonApiService = JsonApiServiceMock.simple();

    TestBed.configureTestingModule({
      providers: [ProjectOverviewService, MockProvider(JsonApiService, jsonApiService), provideMockEnvironment()],
    });

    service = TestBed.inject(ProjectOverviewService);
  }

  it('should expose apiUrl from environment', () => {
    setup();
    expect(service.apiUrl).toBe(MOCK_API_URL);
  });

  it('getProjectById should request node with related counts and map response', async () => {
    setup();
    const mapperSpy = vi.spyOn(ProjectOverviewMapper, 'getProjectOverview').mockReturnValue(MOCK_PROJECT_OVERVIEW);
    jsonApiService.get.mockReturnValue(of(nodeResponse));

    const response = await firstValueFrom(service.getProjectById(projectId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${projectId}/`, {
      related_counts: 'forks,view_only_links',
    });
    expect(mapperSpy).toHaveBeenCalledWith(nodeData);
    expect(response).toEqual({
      data: MOCK_PROJECT_OVERVIEW,
      totalCount: 1,
      pageSize: 1,
      isAnonymous: false,
    });
  });

  it('getProjectById should default isAnonymous to false when meta is missing', async () => {
    setup();
    vi.spyOn(ProjectOverviewMapper, 'getProjectOverview').mockReturnValue(MOCK_PROJECT_OVERVIEW);
    jsonApiService.get.mockReturnValue(of({ data: nodeData } as NodeResponseJsonApi));

    const response = await firstValueFrom(service.getProjectById(projectId));

    expect(response.isAnonymous).toBe(false);
  });

  it('getProjectInstitutions should request institutions and map response', async () => {
    setup();
    const apiResponse = { data: [] } as unknown as InstitutionsJsonApiResponse;
    const mappedInstitutions = MOCK_PROJECT_AFFILIATED_INSTITUTIONS as unknown as Institution[];
    const mapperSpy = vi.spyOn(InstitutionsMapper, 'fromInstitutionsResponse').mockReturnValue(mappedInstitutions);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getProjectInstitutions(projectId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${projectId}/institutions/`, {
      'page[size]': 100,
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(mappedInstitutions);
  });

  it('getProjectIdentifiers should request identifiers and map response', async () => {
    setup();
    const apiResponse = { data: [] } as unknown as IdentifiersResponseJsonApi;
    const mapperSpy = vi.spyOn(IdentifiersMapper, 'fromJsonApi').mockReturnValue([MOCK_PROJECT_IDENTIFIERS]);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getProjectIdentifiers(projectId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${projectId}/identifiers/`);
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual([MOCK_PROJECT_IDENTIFIERS]);
  });

  it('getProjectLicense should request license and map response', async () => {
    setup();
    const licenseId = 'license-1';
    const mappedLicense = { id: licenseId, name: 'MIT' } as LicenseModel;
    const apiResponse = { data: { id: licenseId } } as LicenseResponseJsonApi;
    const mapperSpy = vi.spyOn(LicensesMapper, 'fromLicenseDataJsonApi').mockReturnValue(mappedLicense);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getProjectLicense(licenseId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/licenses/${licenseId}/`);
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse.data);
    expect(response).toEqual(mappedLicense);
  });

  it('getProjectStorage should request storage and map response', async () => {
    setup();
    const mappedStorage = { storageLimitStatus: 'DEFAULT', storageUsage: '1' } as NodeStorageModel;
    const apiResponse = { data: { id: projectId } };
    const mapperSpy = vi.spyOn(NodeStorageMapper, 'getNodeStorage').mockReturnValue(mappedStorage);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getProjectStorage(projectId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${projectId}/storage/`);
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse.data);
    expect(response).toEqual(mappedStorage);
  });

  it('getProjectPreprints should request preprints and map response', async () => {
    setup();
    const apiResponse = { data: [] } as unknown as NodePreprintsResponseJsonApi;
    const mapperSpy = vi.spyOn(NodePreprintMapper, 'getNodePreprints').mockReturnValue(MOCK_NODE_PREPRINTS);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getProjectPreprints(projectId));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${projectId}/preprints/`);
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse.data);
    expect(response).toEqual(MOCK_NODE_PREPRINTS);
  });

  it('updateProjectPublicStatus should bulk patch nodes and map response', async () => {
    setup();
    const payload: PrivacyStatusModel[] = [
      { id: 'node-1', public: true },
      { id: 'node-2', public: false },
    ];
    const mapped = [MOCK_NODE_WITH_ADMIN];
    const mapperSpy = vi.spyOn(BaseNodeMapper, 'getNodesData').mockReturnValue(mapped);
    jsonApiService.patch.mockReturnValue(of([nodeData]));

    const response = await firstValueFrom(service.updateProjectPublicStatus(payload));

    expect(jsonApiService.patch).toHaveBeenCalledWith(
      `${MOCK_API_URL}/nodes/`,
      {
        data: [
          { id: 'node-1', type: 'nodes', attributes: { public: true } },
          { id: 'node-2', type: 'nodes', attributes: { public: false } },
        ],
      },
      undefined,
      JSON_API_BULK_HEADERS
    );
    expect(mapperSpy).toHaveBeenCalledWith([nodeData]);
    expect(response).toEqual(mapped);
  });

  it('duplicateProject should post templated node and map response', async () => {
    setup();
    const mapperSpy = vi.spyOn(BaseNodeMapper, 'getNodeData').mockReturnValue(MOCK_NODE_WITH_ADMIN);
    jsonApiService.post.mockReturnValue(of(nodeResponse));

    const response = await firstValueFrom(service.duplicateProject(projectId, 'My Project'));

    expect(jsonApiService.post).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/`, {
      data: {
        type: 'nodes',
        attributes: {
          template_from: projectId,
          category: 'project',
          title: 'Templated from My Project',
        },
      },
    });
    expect(mapperSpy).toHaveBeenCalledWith(nodeData);
    expect(response).toEqual(MOCK_NODE_WITH_ADMIN);
  });

  it('createComponent should create child without affiliations when none provided', async () => {
    setup();
    jsonApiService.post.mockReturnValue(of({ data: { id: 'child-1' } } as NodeResponseJsonApi));

    const response = await firstValueFrom(service.createComponent(projectId, 'Child', null, ['tag'], null, [], true));

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/nodes/${projectId}/children/`,
      {
        data: {
          type: 'nodes',
          attributes: {
            title: 'Child',
            category: 'project',
            description: '',
            tags: ['tag'],
          },
        },
      },
      { inherit_contributors: true }
    );
    expect(jsonApiService.patch).not.toHaveBeenCalled();
    expect(response).toBeUndefined();
  });

  it('createComponent should include region and patch affiliations when provided', async () => {
    setup();
    jsonApiService.post.mockReturnValue(of({ data: { id: 'child-1' } } as NodeResponseJsonApi));
    jsonApiService.patch.mockReturnValue(of(undefined));

    await firstValueFrom(
      service.createComponent(projectId, 'Child', 'Desc', [], 'us-east', ['inst-1', 'inst-2'], false)
    );

    expect(jsonApiService.post).toHaveBeenCalledWith(
      `${MOCK_API_URL}/nodes/${projectId}/children/`,
      {
        data: {
          type: 'nodes',
          attributes: {
            title: 'Child',
            category: 'project',
            description: 'Desc',
            tags: [],
          },
        },
      },
      { inherit_contributors: false, region: 'us-east' }
    );
    expect(jsonApiService.patch).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/child-1/relationships/institutions/`, {
      data: [
        { type: 'institutions', id: 'inst-1' },
        { type: 'institutions', id: 'inst-2' },
      ],
    });
  });

  it('getComponents should request children with embeds and map response', async () => {
    setup();
    const mapped: PaginatedData<(typeof MOCK_NODE_WITH_ADMIN)[]> = {
      data: [MOCK_NODE_WITH_ADMIN],
      totalCount: 1,
      pageSize: 10,
    };
    const apiResponse = {
      data: [],
      meta: { total: 1, per_page: 10, version: '2.0' },
    } as NodesResponseJsonApi;
    const mapperSpy = vi.spyOn(BaseNodeMapper, 'getNodesWithEmbedsAndTotalData').mockReturnValue(mapped);
    jsonApiService.get.mockReturnValue(of(apiResponse));

    const response = await firstValueFrom(service.getComponents(projectId, 2, 25));

    expect(jsonApiService.get).toHaveBeenCalledWith(`${MOCK_API_URL}/nodes/${projectId}/children/`, {
      embed: 'bibliographic_contributors',
      'fields[users]': 'family_name,full_name,given_name,middle_name',
      page: 2,
      'page[size]': 25,
      sort: '_order',
    });
    expect(mapperSpy).toHaveBeenCalledWith(apiResponse);
    expect(response).toEqual(mapped);
  });

  it('getParentProject should request node with bypass context and map response', async () => {
    setup();
    const mapperSpy = vi.spyOn(BaseNodeMapper, 'getNodeWithEmbedContributors').mockReturnValue(MOCK_NODE_WITH_ADMIN);
    jsonApiService.get.mockReturnValue(of(nodeResponse));

    const response = await firstValueFrom(service.getParentProject(projectId));

    expect(jsonApiService.get).toHaveBeenCalledWith(
      `${MOCK_API_URL}/nodes/${projectId}/`,
      { 'embed[]': ['bibliographic_contributors'] },
      expect.any(HttpContext)
    );
    const context = jsonApiService.get.mock.calls[0][2] as HttpContext;
    expect(context.get(BYPASS_ERROR_INTERCEPTOR)).toBe(true);
    expect(mapperSpy).toHaveBeenCalledWith(nodeData);
    expect(response).toEqual(MOCK_NODE_WITH_ADMIN);
  });

  it('reorderComponents should bulk patch component order', async () => {
    setup();
    jsonApiService.patch.mockReturnValue(of(undefined));

    await firstValueFrom(service.reorderComponents(projectId, ['c-2', 'c-1']));

    expect(jsonApiService.patch).toHaveBeenCalledWith(
      `${MOCK_API_URL}/nodes/${projectId}/reorder_components/`,
      {
        data: [
          { type: 'nodes', id: 'c-2', attributes: { _order: 0 } },
          { type: 'nodes', id: 'c-1', attributes: { _order: 1 } },
        ],
      },
      undefined,
      JSON_API_BULK_HEADERS
    );
  });
});
