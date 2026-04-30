import { MockProvider } from 'ng-mocks';

import { firstValueFrom } from 'rxjs';

import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ENVIRONMENT_DO_NO_USE } from '@core/constants/environment.token';
import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { ContributorAddModel } from '@osf/shared/models/contributors/contributor-add.model';

import {
  getContributorsListData,
  getContributorsSearchData,
  getContributorsSearchDataSecondUser,
  getContributorsSearchDataWithPagination,
} from '@testing/data/contributors/contributors.data';
import { provideOSFCore, provideOSFHttp } from '@testing/osf.testing.provider';

import { ContributorsService } from './contributors.service';

const SHARE_TROVE_URL = 'https://share.osf.io/trove';
const API_URL = 'http://localhost:8000/v2';
const WEB_URL = 'http://localhost:4200';

describe('ContributorsService', () => {
  let service: ContributorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideOSFCore(),
        provideOSFHttp(),
        MockProvider(ENVIRONMENT_DO_NO_USE, {
          production: false,
          apiDomainUrl: 'http://localhost:8000',
          shareTroveUrl: SHARE_TROVE_URL,
          webUrl: WEB_URL,
        }),
        ContributorsService,
      ],
    });

    service = TestBed.inject(ContributorsService);
  });

  it('getUsersByLink should set isBibliographic: true for users returned from search', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.getUsersByLink(`${SHARE_TROVE_URL}/index-card-search`));

    const req = httpMock.expectOne(`${SHARE_TROVE_URL}/index-card-search`);
    expect(req.request.method).toBe('GET');
    req.flush(getContributorsSearchData());

    const result = await resultPromise;
    expect(result.users[0].isBibliographic).toBe(true);
    expect(result.users[0].permission).toBe(ContributorPermission.Write);
    expect(result.users[0].fullName).toBe('Test User');
    expect(result.users[0].id).toBe('abc12');
    expect(result.totalCount).toBe(1);
    expect(result.next).toBeNull();
    expect(result.previous).toBeNull();

    httpMock.verify();
  });

  it('getUsersByLink should return next and previous pagination links when present', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.getUsersByLink(`${SHARE_TROVE_URL}/index-card-search`));

    const req = httpMock.expectOne(`${SHARE_TROVE_URL}/index-card-search`);
    req.flush(getContributorsSearchDataWithPagination());

    const result = await resultPromise;
    expect(result.next).toBe('https://share.osf.io/trove/index-card-search?page=2');
    expect(result.previous).toBe('https://share.osf.io/trove/index-card-search?page=1');

    httpMock.verify();
  });

  it('searchUsersByName should search by name with correct query params', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.searchUsersByName('alice'));

    const req = httpMock.expectOne((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('cardSearchFilter[resourceType]')).toBe('Person');
    expect(req.request.params.get('cardSearchText[name]')).toBe('alice*');
    req.flush(getContributorsSearchData());

    const result = await resultPromise;
    expect(result.users[0].isBibliographic).toBe(true);

    httpMock.verify();
  });

  it('searchUsersById should search by id with correct query params', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.searchUsersById('abc12'));

    const req = httpMock.expectOne((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('cardSearchFilter[sameAs]')).toBe(`${WEB_URL}/abc12`);
    req.flush(getContributorsSearchData());

    const result = await resultPromise;
    expect(result.users[0].isBibliographic).toBe(true);

    httpMock.verify();
  });

  it('searchUsers should call only searchUsersByName when value length is not 5', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.searchUsers('ali'));

    const reqs = httpMock.match((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
    expect(reqs.length).toBe(1);
    reqs[0].flush(getContributorsSearchData());

    const result = await resultPromise;
    expect(result.users.length).toBe(1);

    httpMock.verify();
  });

  it('searchUsers should forkJoin name and id searches when value length is 5 and deduplicate results', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.searchUsers('alice'));

    const reqs = httpMock.match((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
    expect(reqs.length).toBe(2);
    reqs[0].flush(getContributorsSearchData());
    reqs[1].flush(getContributorsSearchData());

    const result = await resultPromise;
    expect(result.users.length).toBe(1);

    httpMock.verify();
  });

  it('searchUsers should merge unique users from name and id searches', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.searchUsers('alice'));

    const reqs = httpMock.match((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
    expect(reqs.length).toBe(2);
    reqs[0].flush(getContributorsSearchData());
    reqs[1].flush(getContributorsSearchDataSecondUser());

    const result = await resultPromise;
    expect(result.users.length).toBe(2);
    expect(result.users[0].id).toBe('abc12');
    expect(result.users[1].id).toBe('xyz99');

    httpMock.verify();
  });

  it('getAllContributors should GET contributors with pagination params', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.getAllContributors(ResourceType.Project, 'node-id', 1, 10));

    const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/?page=1&page%5Bsize%5D=10`);
    expect(req.request.method).toBe('GET');
    req.flush(getContributorsListData());

    const result = await resultPromise;
    expect(result.totalCount).toBe(1);
    expect(result.data[0].isBibliographic).toBe(true);

    httpMock.verify();
  });

  it('getBibliographicContributors should GET bibliographic_contributors endpoint', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.getBibliographicContributors(ResourceType.Project, 'node-id', 1, 10));

    const req = httpMock.expectOne(`${API_URL}/nodes/node-id/bibliographic_contributors/?page=1&page%5Bsize%5D=10`);
    expect(req.request.method).toBe('GET');
    req.flush(getContributorsListData());

    await resultPromise;
    httpMock.verify();
  });

  it('bulkAddContributors should return empty array when contributors list is empty', async () => {
    const result = await firstValueFrom(service.bulkAddContributors(ResourceType.Project, 'node-id', []));
    expect(result).toEqual([]);
  });

  it('bulkAddContributors should POST registered contributor with correct payload', async () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const contributor: ContributorAddModel = {
      id: 'user-id',
      fullName: 'John Doe',
      isBibliographic: true,
      permission: ContributorPermission.Write,
    };

    const resultPromise = firstValueFrom(service.bulkAddContributors(ResourceType.Project, 'node-id', [contributor]));

    const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.data[0].type).toBe('contributors');
    expect(req.request.body.data[0].attributes.bibliographic).toBe(true);
    req.flush(getContributorsListData());

    await resultPromise;
    httpMock.verify();
  });

  it('bulkAddContributors should POST unregistered contributor when id is missing', async () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const contributor: ContributorAddModel = {
      fullName: 'Unregistered User',
      email: 'new@example.com',
      isBibliographic: false,
      permission: ContributorPermission.Read,
    };

    const resultPromise = firstValueFrom(service.bulkAddContributors(ResourceType.Project, 'node-id', [contributor]));

    const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.data[0].attributes.full_name).toBe('Unregistered User');
    req.flush(getContributorsListData());

    await resultPromise;
    httpMock.verify();
  });

  it('bulkAddContributors should POST with childNodeIds when provided', async () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const contributor: ContributorAddModel = {
      id: 'user-id',
      fullName: 'John Doe',
      isBibliographic: true,
      permission: ContributorPermission.Write,
    };

    const resultPromise = firstValueFrom(
      service.bulkAddContributors(ResourceType.Project, 'node-id', [contributor], ['child-1'])
    );

    const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/`);
    expect(req.request.body.data[0].attributes.child_nodes).toEqual(['child-1']);
    req.flush(getContributorsListData());

    await resultPromise;
    httpMock.verify();
  });

  it('bulkUpdateContributors should return empty array when contributors list is empty', async () => {
    const result = await firstValueFrom(service.bulkUpdateContributors(ResourceType.Project, 'node-id', []));
    expect(result).toEqual([]);
  });

  it('bulkUpdateContributors should PATCH contributors with correct payload', async () => {
    const httpMock = TestBed.inject(HttpTestingController);
    const contributor: ContributorModel = {
      id: 'node-id-user-id',
      userId: 'user-id',
      type: 'contributors',
      fullName: 'John Doe',
      givenName: 'John',
      familyName: 'Doe',
      isUnregisteredContributor: false,
      permission: ContributorPermission.Write,
      isBibliographic: true,
      isCurator: false,
      index: 0,
      education: [],
      employment: [],
      deactivated: false,
    };

    const resultPromise = firstValueFrom(
      service.bulkUpdateContributors(ResourceType.Project, 'node-id', [contributor])
    );

    const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.data[0].id).toBe('node-id-user-id');
    expect(req.request.body.data[0].attributes.bibliographic).toBe(true);
    req.flush(getContributorsListData());

    await resultPromise;
    httpMock.verify();
  });

  it('addContributorsFromProject should PATCH with copy_contributors_from_parent_project param', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.addContributorsFromProject(ResourceType.Project, 'node-id'));

    const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/?copy_contributors_from_parent_project=true`);
    expect(req.request.method).toBe('PATCH');
    req.flush(null);

    await resultPromise;
    httpMock.verify();
  });

  it('deleteContributor should DELETE contributor by userId', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.deleteContributor(ResourceType.Project, 'node-id', 'user-id'));

    const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/user-id/`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    await resultPromise;
    httpMock.verify();
  });

  it('deleteContributor should DELETE with include_children param when removeFromChildren is true', async () => {
    const httpMock = TestBed.inject(HttpTestingController);

    const resultPromise = firstValueFrom(service.deleteContributor(ResourceType.Project, 'node-id', 'user-id', true));

    const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/user-id/?include_children=true`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    await resultPromise;
    httpMock.verify();
  });

  it('getBaseUrl should throw error for unsupported resource type', () => {
    expect(() => service.getAllContributors(ResourceType.File, 'id', 1, 10).subscribe()).toThrowError(
      'Unsupported resource type: 1'
    );
  });
});
