import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_TABLE_PARAMS } from '@osf/shared/constants/default-table-params.constants';
import { RegistryResourceType } from '@osf/shared/enums/registry-resource.enum';
import { PaginatedData } from '@osf/shared/models/paginated-data.model';

import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';
import { EnvironmentTokenMock } from '@testing/providers/environment.token.mock';

import { GetRegistryResourcesJsonApi, RegistryResource, RegistryResourceDataJsonApi } from '../models';

import { RegistryResourcesService } from './registry-resources.service';

const apiResource: RegistryResourceDataJsonApi = {
  id: 'res-1',
  type: 'resources',
  attributes: {
    description: 'Dataset description',
    finalized: true,
    pid: '10.123/test',
    resource_type: RegistryResourceType.Data,
  },
};

const mappedResource: RegistryResource = {
  id: 'res-1',
  description: 'Dataset description',
  finalized: true,
  type: RegistryResourceType.Data,
  pid: '10.123/test',
};

describe('RegistryResourcesService', () => {
  let service: RegistryResourcesService;
  let httpMock: HttpTestingController;
  const apiBase = `${EnvironmentTokenMock.useValue.apiDomainUrl}/v2`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideOSFCore(), provideOSFHttp(), RegistryResourcesService],
    });
    service = TestBed.inject(RegistryResourcesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should get resources with default pagination params and map the response', () => {
    const response: GetRegistryResourcesJsonApi = {
      data: [apiResource],
      meta: { total: 12, per_page: 10 },
    };
    let result: PaginatedData<RegistryResource[]> | undefined;

    service.getResources('reg-1').subscribe((value) => (result = value));

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${apiBase}/registrations/reg-1/resources/` &&
        request.params.get('fields[resources]') === 'description,finalized,resource_type,pid' &&
        request.params.get('page') === '1' &&
        request.params.get('page[size]') === String(DEFAULT_TABLE_PARAMS.rows)
    );
    expect(req.request.method).toBe('GET');
    req.flush(response);

    expect(result).toEqual({
      data: [mappedResource],
      totalCount: 12,
      pageSize: 10,
    });
    httpMock.verify();
  });

  it('should get resources with custom page and page size', () => {
    const response: GetRegistryResourcesJsonApi = {
      data: [apiResource],
      meta: { total: 25, per_page: 5 },
    };
    let result: PaginatedData<RegistryResource[]> | undefined;

    service.getResources('reg-1', 3, 5).subscribe((value) => (result = value));

    const req = httpMock.expectOne(
      (request) =>
        request.url === `${apiBase}/registrations/reg-1/resources/` &&
        request.params.get('page') === '3' &&
        request.params.get('page[size]') === '5'
    );
    expect(req.request.method).toBe('GET');
    req.flush(response);

    expect(result).toEqual({
      data: [mappedResource],
      totalCount: 25,
      pageSize: 5,
    });
    httpMock.verify();
  });

  it('should fall back to default page size when per_page is missing', () => {
    const response: GetRegistryResourcesJsonApi = {
      data: [apiResource],
      meta: { total: 1 },
    };
    let result: PaginatedData<RegistryResource[]> | undefined;

    service.getResources('reg-1').subscribe((value) => (result = value));

    const req = httpMock.expectOne((request) => request.url === `${apiBase}/registrations/reg-1/resources/`);
    req.flush(response);

    expect(result?.pageSize).toBe(DEFAULT_TABLE_PARAMS.rows);
    httpMock.verify();
  });
});
