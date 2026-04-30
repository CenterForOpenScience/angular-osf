import { ContributorPermission } from '@osf/shared/enums/contributors/contributor-permission.enum';

export function getContributorsSearchData() {
  return {
    data: {
      attributes: { totalResultCount: 1 },
      relationships: {
        searchResultPage: {
          data: [{ id: 'search-result-1' }],
          links: { first: { href: '' }, next: null, prev: null },
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
}

export function getContributorsSearchDataWithPagination() {
  return {
    ...getContributorsSearchData(),
    data: {
      ...getContributorsSearchData().data,
      relationships: {
        ...getContributorsSearchData().data.relationships,
        searchResultPage: {
          ...getContributorsSearchData().data.relationships.searchResultPage,
          links: {
            first: { href: '' },
            next: { href: 'https://share.osf.io/trove/index-card-search?page=2' },
            prev: { href: 'https://share.osf.io/trove/index-card-search?page=1' },
          },
        },
      },
    },
  };
}

export function getContributorsSearchDataSecondUser() {
  return {
    data: {
      attributes: { totalResultCount: 1 },
      relationships: {
        searchResultPage: {
          data: [{ id: 'search-result-2' }],
          links: { first: { href: '' }, next: null, prev: null },
        },
        relatedProperties: { data: [] },
      },
      links: { self: '' },
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
            '@id': 'https://osf.io/xyz99',
            resourceType: [{ '@id': 'Person' }],
            name: [{ '@value': 'Other User' }],
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
}

export function getContributorsListData() {
  return {
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
}
