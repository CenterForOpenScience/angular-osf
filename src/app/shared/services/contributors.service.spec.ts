import { HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';

import { ENVIRONMENT_DO_NO_USE } from '@core/constants/environment.token';
import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ContributorModel } from '@osf/shared/models/contributors/contributor.model';
import { ContributorAddModel } from '@osf/shared/models/contributors/contributor-add.model';
import { SearchUserDataModel } from '@osf/shared/models/user/search-user-data.model';

import { ContributorsService } from './contributors.service';

import { OSFTestingModule } from '@testing/osf.testing.module';

const SHARE_TROVE_URL = 'https://share.osf.io/trove';
const API_URL = 'http://localhost:8000/v2';
const WEB_URL = 'http://localhost:4200';

const mockSearchResponse = {
  data: {
    attributes: { totalResultCount: 1 },
    relationships: {
      searchResultPage: {
        data: [{ id: 'search-result-1' }],
        links: { first: { href: '' }, next: null as any, prev: null as any },
      },
      relatedProperties: { data: [] },
    },
    links: { self: '' },
  },
  included: [
    {
      id: 'search-result-1',
      type: 'search-result',
      relationships: { indexCard: { data: { id: 'index-card-1', type: 'index-card' } } },
      attributes: { matchEvidence: [], cardSearchResultCount: 1 },
    },
    {
      id: 'index-card-1',
      type: 'index-card',
      attributes: {
        resourceMetadata: {
          '@id': 'https://osf.io/abc12',
          resourceType: [{ '@id': 'Person' }],
          name: [{ '@value': 'Test User' }],
          title: [],
          fileName: [],
          description: [],
          dateCreated: [],
          dateModified: [],
          dateWithdrawn: [],
          creator: [],
          hasVersion: [],
          identifier: [],
          publisher: [],
          rights: [],
          language: [],
          statedConflictOfInterest: [],
          resourceNature: [],
          isPartOfCollection: [],
          storageByteCount: [],
          storageRegion: [],
          usage: { viewCount: [], downloadCount: [] },
          hasOsfAddon: [],
          funder: [],
          affiliation: [],
          qualifiedAttribution: [],
          isPartOf: [],
          isContainedBy: [],
          conformsTo: [],
          hasPreregisteredAnalysisPlan: [],
          hasPreregisteredStudyDesign: [],
          hasDataResource: [],
          hasAnalyticCodeResource: [],
          hasMaterialsResource: [],
          hasPapersResource: [],
          hasSupplementalResource: [],
        },
        resourceIdentifier: [],
      },
    },
  ],
};

const mockSearchResponseWithNext = {
  ...mockSearchResponse,
  data: {
    ...mockSearchResponse.data,
    relationships: {
      ...mockSearchResponse.data.relationships,
      searchResultPage: {
        ...mockSearchResponse.data.relationships.searchResultPage,
        links: {
          first: { href: '' },
          next: { href: 'https://share.osf.io/trove/index-card-search?page=2' },
          prev: { href: 'https://share.osf.io/trove/index-card-search?page=1' },
        },
      },
    },
  },
};

const mockContributorsResponse = {
  data: [
    {
      id: 'node-id-user-id',
      type: 'contributors',
      attributes: {
        bibliographic: true,
        index: 0,
        is_curator: false,
        permission: ContributorPermission.Write,
        unregistered_contributor: null,
      },
      relationships: {
        users: { links: { related: { href: '', meta: {} } }, data: { id: 'user-id', type: 'users' } },
        node: { links: { related: { href: '', meta: {} } }, data: { id: 'node-id', type: 'nodes' } },
      },
      embeds: {
        users: {
          data: {
            id: 'user-id',
            type: 'users',
            attributes: {
              full_name: 'John Doe',
              given_name: 'John',
              family_name: 'Doe',
              education: [],
              employment: [],
            },
          },
        },
      },
    },
  ],
  links: {},
  meta: { total: 1, per_page: 10, version: '2.0' },
};

describe('Service: Contributors', () => {
  let service: ContributorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OSFTestingModule],
      providers: [
        ContributorsService,
        {
          provide: ENVIRONMENT_DO_NO_USE,
          useValue: {
            production: false,
            apiDomainUrl: 'http://localhost:8000',
            shareTroveUrl: SHARE_TROVE_URL,
            webUrl: WEB_URL,
          },
        },
      ],
    });

    service = TestBed.inject(ContributorsService);
  });

  describe('getUsersByLink()', () => {
    it('should set isBibliographic: true for users returned from search', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result!: SearchUserDataModel<ContributorAddModel[]>;
        service.getUsersByLink(`${SHARE_TROVE_URL}/index-card-search`).subscribe((r) => {
          result = r;
        });

        const req = httpMock.expectOne(`${SHARE_TROVE_URL}/index-card-search`);
        expect(req.request.method).toBe('GET');
        req.flush(mockSearchResponse);

        expect(result.users[0].isBibliographic).toBe(true);
        expect(result.users[0].permission).toBe(ContributorPermission.Write);
        expect(result.users[0].fullName).toBe('Test User');
        expect(result.users[0].id).toBe('abc12');
        expect(result.totalCount).toBe(1);
        expect(result.next).toBeNull();
        expect(result.previous).toBeNull();

        httpMock.verify();
      }
    ));

    it('should return next and previous pagination links when present', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result!: SearchUserDataModel<ContributorAddModel[]>;
        service.getUsersByLink(`${SHARE_TROVE_URL}/index-card-search`).subscribe((r) => {
          result = r;
        });

        const req = httpMock.expectOne(`${SHARE_TROVE_URL}/index-card-search`);
        req.flush(mockSearchResponseWithNext);

        expect(result.next).toBe('https://share.osf.io/trove/index-card-search?page=2');
        expect(result.previous).toBe('https://share.osf.io/trove/index-card-search?page=1');

        httpMock.verify();
      }
    ));
  });

  describe('searchUsersByName()', () => {
    it('should search by name with correct query params', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result!: SearchUserDataModel<ContributorAddModel[]>;
        service.searchUsersByName('alice').subscribe((r) => {
          result = r;
        });

        const req = httpMock.expectOne((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
        expect(req.request.method).toBe('GET');
        expect(req.request.params.get('cardSearchFilter[resourceType]')).toBe('Person');
        expect(req.request.params.get('cardSearchText[name]')).toBe('alice*');
        req.flush(mockSearchResponse);

        expect(result.users[0].isBibliographic).toBe(true);
        httpMock.verify();
      }
    ));
  });

  describe('searchUsersById()', () => {
    it('should search by id with correct query params', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result!: SearchUserDataModel<ContributorAddModel[]>;
        service.searchUsersById('abc12').subscribe((r) => {
          result = r;
        });

        const req = httpMock.expectOne((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
        expect(req.request.method).toBe('GET');
        expect(req.request.params.get('cardSearchFilter[sameAs]')).toBe(`${WEB_URL}/abc12`);
        req.flush(mockSearchResponse);

        expect(result.users[0].isBibliographic).toBe(true);
        httpMock.verify();
      }
    ));
  });

  describe('searchUsers()', () => {
    it('should call only searchUsersByName when value length is not 5', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result!: SearchUserDataModel<ContributorAddModel[]>;
        service.searchUsers('ali').subscribe((r) => {
          result = r;
        });

        const reqs = httpMock.match((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
        expect(reqs.length).toBe(1);
        reqs[0].flush(mockSearchResponse);

        expect(result.users.length).toBe(1);
        httpMock.verify();
      }
    ));

    it('should forkJoin name and id searches when value length is 5', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result!: SearchUserDataModel<ContributorAddModel[]>;
        service.searchUsers('alice').subscribe((r) => {
          result = r;
        });

        const reqs = httpMock.match((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
        expect(reqs.length).toBe(2);
        reqs[0].flush(mockSearchResponse);
        reqs[1].flush(mockSearchResponse);

        // Both responses have same user (id 'abc12'), so dedup removes the duplicate
        expect(result.users.length).toBe(1);
        httpMock.verify();
      }
    ));

    it('should merge unique users from name and id searches', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        const secondUserResponse = {
          ...mockSearchResponse,
          data: {
            ...mockSearchResponse.data,
            attributes: { totalResultCount: 1 },
            relationships: {
              ...mockSearchResponse.data.relationships,
              searchResultPage: {
                data: [{ id: 'search-result-2' }],
                links: { first: { href: '' }, next: null as any, prev: null as any },
              },
            },
          },
          included: [
            {
              id: 'search-result-2',
              type: 'search-result',
              relationships: { indexCard: { data: { id: 'index-card-2', type: 'index-card' } } },
              attributes: { matchEvidence: [], cardSearchResultCount: 1 },
            },
            {
              id: 'index-card-2',
              type: 'index-card',
              attributes: {
                resourceMetadata: {
                  ...mockSearchResponse.included[1].attributes.resourceMetadata,
                  '@id': 'https://osf.io/xyz99',
                  name: [{ '@value': 'Other User' }],
                },
                resourceIdentifier: [],
              },
            },
          ],
        };

        let result!: SearchUserDataModel<ContributorAddModel[]>;
        service.searchUsers('alice').subscribe((r) => {
          result = r;
        });

        const reqs = httpMock.match((request) => request.url === `${SHARE_TROVE_URL}/index-card-search`);
        expect(reqs.length).toBe(2);

        // forkJoin calls searchUsersByName first, then searchUsersById
        reqs[0].flush(mockSearchResponse);
        reqs[1].flush(secondUserResponse);

        expect(result.users.length).toBe(2);
        expect(result.users[0].id).toBe('abc12');
        expect(result.users[1].id).toBe('xyz99');
        httpMock.verify();
      }
    ));
  });

  describe('getAllContributors()', () => {
    it('should GET contributors with pagination params', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        let result: any;
        service.getAllContributors(ResourceType.Project, 'node-id', 1, 10).subscribe((r) => {
          result = r;
        });

        const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/?page=1&page%5Bsize%5D=10`);
        expect(req.request.method).toBe('GET');
        req.flush(mockContributorsResponse);

        expect(result.totalCount).toBe(1);
        expect(result.data[0].isBibliographic).toBe(true);
        httpMock.verify();
      }
    ));
  });

  describe('getBibliographicContributors()', () => {
    it('should GET bibliographic_contributors endpoint', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        service.getBibliographicContributors(ResourceType.Project, 'node-id', 1, 10).subscribe();

        const req = httpMock.expectOne(`${API_URL}/nodes/node-id/bibliographic_contributors/?page=1&page%5Bsize%5D=10`);
        expect(req.request.method).toBe('GET');
        req.flush(mockContributorsResponse);

        httpMock.verify();
      }
    ));
  });

  describe('bulkAddContributors()', () => {
    it('should return empty observable when contributors list is empty', () => {
      let result!: ContributorModel[];
      service.bulkAddContributors(ResourceType.Project, 'node-id', []).subscribe((r) => {
        result = r;
      });

      expect(result).toEqual([]);
    });

    it('should POST registered contributor with correct payload', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        const contributor: ContributorAddModel = {
          id: 'user-id',
          fullName: 'John Doe',
          isBibliographic: true,
          permission: ContributorPermission.Write,
        };

        service.bulkAddContributors(ResourceType.Project, 'node-id', [contributor]).subscribe();

        const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.data[0].type).toBe('contributors');
        expect(req.request.body.data[0].attributes.bibliographic).toBe(true);
        req.flush(mockContributorsResponse);

        httpMock.verify();
      }
    ));

    it('should POST unregistered contributor when id is missing', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        const contributor: ContributorAddModel = {
          fullName: 'Unregistered User',
          email: 'new@example.com',
          isBibliographic: false,
          permission: ContributorPermission.Read,
        };

        service.bulkAddContributors(ResourceType.Project, 'node-id', [contributor]).subscribe();

        const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body.data[0].attributes.full_name).toBe('Unregistered User');
        req.flush(mockContributorsResponse);

        httpMock.verify();
      }
    ));

    it('should POST with childNodeIds when provided', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        const contributor: ContributorAddModel = {
          id: 'user-id',
          fullName: 'John Doe',
          isBibliographic: true,
          permission: ContributorPermission.Write,
        };

        service.bulkAddContributors(ResourceType.Project, 'node-id', [contributor], ['child-1']).subscribe();

        const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/`);
        expect(req.request.body.data[0].attributes.child_nodes).toEqual(['child-1']);
        req.flush(mockContributorsResponse);

        httpMock.verify();
      }
    ));
  });

  describe('bulkUpdateContributors()', () => {
    it('should return empty observable when contributors list is empty', () => {
      let result!: ContributorModel[];
      service.bulkUpdateContributors(ResourceType.Project, 'node-id', []).subscribe((r) => {
        result = r;
      });

      expect(result).toEqual([]);
    });

    it('should PATCH contributors with correct payload', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
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

        service.bulkUpdateContributors(ResourceType.Project, 'node-id', [contributor]).subscribe();

        const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/`);
        expect(req.request.method).toBe('PATCH');
        expect(req.request.body.data[0].id).toBe('node-id-user-id');
        expect(req.request.body.data[0].attributes.bibliographic).toBe(true);
        req.flush(mockContributorsResponse);

        httpMock.verify();
      }
    ));
  });

  describe('addContributorsFromProject()', () => {
    it('should PATCH with copy_contributors_from_parent_project param', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        service.addContributorsFromProject(ResourceType.Project, 'node-id').subscribe();

        const req = httpMock.expectOne(
          `${API_URL}/nodes/node-id/contributors/?copy_contributors_from_parent_project=true`
        );
        expect(req.request.method).toBe('PATCH');
        req.flush(null);

        httpMock.verify();
      }
    ));
  });

  describe('deleteContributor()', () => {
    it('should DELETE contributor by userId', inject([HttpTestingController], (httpMock: HttpTestingController) => {
      service.deleteContributor(ResourceType.Project, 'node-id', 'user-id').subscribe();

      const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/user-id/`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      httpMock.verify();
    }));

    it('should DELETE with include_children param when removeFromChildren is true', inject(
      [HttpTestingController],
      (httpMock: HttpTestingController) => {
        service.deleteContributor(ResourceType.Project, 'node-id', 'user-id', true).subscribe();

        const req = httpMock.expectOne(`${API_URL}/nodes/node-id/contributors/user-id/?include_children=true`);
        expect(req.request.method).toBe('DELETE');
        req.flush(null);

        httpMock.verify();
      }
    ));
  });

  describe('getBaseUrl() error case', () => {
    it('should throw error for unsupported resource type', () => {
      expect(() => service.getAllContributors(ResourceType.File, 'id', 1, 10).subscribe()).toThrowError(
        'Unsupported resource type: 1'
      );
    });
  });
});
