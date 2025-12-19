import {
  InstitutionDepartment,
  InstitutionSearchFilter,
  InstitutionSummaryMetrics,
  InstitutionUser,
} from '@osf/features/admin-institutions/models';
import { ResourceType } from '@osf/shared/enums/resource-type.enum';
import { ResourceModel } from '@osf/shared/models/search/resource.model';

export const MOCK_ADMIN_INSTITUTIONS_INSTITUTION = {
  iri: 'https://api.test.osf.io/v2/institutions/test/',
  iris: ['https://api.test.osf.io/v2/institutions/test/'],
};

export const MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCE: ResourceModel = {
  absoluteUrl: 'https://osf.io/test/',
  resourceType: ResourceType.Project,
  title: 'Test Project',
  dateCreated: new Date('2024-01-01'),
  dateModified: new Date('2024-01-02'),
  doi: ['https://doi.org/10.1234/test'],
  creators: [],
  identifiers: [],
  language: 'en',
  addons: [],
  isPartOfCollection: { absoluteUrl: '', name: '' },
  funders: [],
  affiliations: [],
  qualifiedAttribution: [],
  hasDataResource: '',
  hasAnalyticCodeResource: false,
  hasMaterialsResource: false,
  hasPapersResource: false,
  hasSupplementalResource: false,
  context: null,
};

export const MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCES = [MOCK_ADMIN_INSTITUTIONS_PROJECT_RESOURCE];

export const MOCK_ADMIN_INSTITUTIONS_PREPRINT_RESOURCE: ResourceModel = {
  absoluteUrl: 'https://osf.io/test/',
  resourceType: ResourceType.Preprint,
  title: 'Test Preprint',
  dateCreated: new Date('2024-01-01'),
  dateModified: new Date('2024-01-02'),
  doi: ['https://doi.org/10.1234/test'],
  creators: [],
  identifiers: [],
  language: 'en',
  addons: [],
  isPartOfCollection: { absoluteUrl: '', name: '' },
  funders: [],
  affiliations: [],
  qualifiedAttribution: [],
  hasDataResource: '',
  hasAnalyticCodeResource: false,
  hasMaterialsResource: false,
  hasPapersResource: false,
  hasSupplementalResource: false,
  context: null,
};

export const MOCK_ADMIN_INSTITUTIONS_PREPRINT_RESOURCES = [MOCK_ADMIN_INSTITUTIONS_PREPRINT_RESOURCE];

export const MOCK_ADMIN_INSTITUTIONS_REGISTRATION_RESOURCE: ResourceModel = {
  absoluteUrl: 'https://osf.io/test/',
  resourceType: ResourceType.Registration,
  title: 'Test Registration',
  dateCreated: new Date('2024-01-01'),
  dateModified: new Date('2024-01-02'),
  doi: ['https://doi.org/10.1234/test'],
  creators: [],
  identifiers: [],
  language: 'en',
  addons: [],
  isPartOfCollection: { absoluteUrl: '', name: '' },
  funders: [],
  affiliations: [],
  qualifiedAttribution: [],
  hasDataResource: '',
  hasAnalyticCodeResource: false,
  hasMaterialsResource: false,
  hasPapersResource: false,
  hasSupplementalResource: false,
  context: null,
};

export const MOCK_ADMIN_INSTITUTIONS_REGISTRATION_RESOURCES = [MOCK_ADMIN_INSTITUTIONS_REGISTRATION_RESOURCE];

export const MOCK_ADMIN_INSTITUTIONS_SUMMARY_METRICS: InstitutionSummaryMetrics = {
  reportYearmonth: '2024-01',
  userCount: 100,
  publicProjectCount: 50,
  privateProjectCount: 25,
  publicRegistrationCount: 30,
  embargoedRegistrationCount: 10,
  publishedPreprintCount: 20,
  publicFileCount: 500,
  storageByteCount: 1073741824,
  monthlyLoggedInUserCount: 80,
  monthlyActiveUserCount: 60,
};

export const MOCK_ADMIN_INSTITUTIONS_DEPARTMENTS: InstitutionDepartment[] = [
  { id: 'dept-1', name: 'Computer Science', numberOfUsers: 45, selfLink: '/departments/cs' },
  { id: 'dept-2', name: 'Biology', numberOfUsers: 30, selfLink: '/departments/bio' },
];

export const MOCK_ADMIN_INSTITUTIONS_SEARCH_FILTERS: InstitutionSearchFilter[] = [
  { id: 'filter-1', label: 'Filter 1', value: 10 },
  { id: 'filter-2', label: 'Filter 2', value: 5 },
];

export const MOCK_ADMIN_INSTITUTIONS_STORAGE_FILTERS: InstitutionSearchFilter[] = [
  { id: 'storage-1', label: 'US East', value: 100 },
  { id: 'storage-2', label: 'US East', value: 50 },
  { id: 'storage-3', label: 'EU West', value: 75 },
];

export const MOCK_ADMIN_INSTITUTIONS_INSTITUTION_WITH_METRICS = {
  id: 'test-institution',
  type: 'institution',
  name: 'Test Institution',
  description: 'A test institution',
  iri: 'https://api.test.osf.io/v2/institutions/test/',
  rorIri: null,
  iris: ['https://api.test.osf.io/v2/institutions/test/'],
  assets: {
    logo: 'logo.png',
    logo_rounded: 'logo_rounded.png',
    banner: 'banner.png',
  },
  institutionalRequestAccessEnabled: true,
  logoPath: 'logo.png',
  userMetricsUrl: 'https://api.test.osf.io/v2/institutions/test/users/metrics/',
  linkToExternalReportsArchive: null,
};

export const MOCK_ADMIN_INSTITUTIONS_USER: InstitutionUser = {
  id: 'user-1',
  userId: 'user123',
  userName: 'john.doe@example.com',
  department: 'Computer Science',
  orcidId: '0000-0000-0000-0000',
  publicProjects: 5,
  privateProjects: 3,
  publicRegistrationCount: 2,
  embargoedRegistrationCount: 1,
  publishedPreprintCount: 4,
  monthLasLogin: '2024-01',
  monthLastActive: '2024-01',
  accountCreationDate: '2023-06-15',
  storageByteCount: 1073741824,
  publicFileCount: 100,
  reportYearMonth: '2024-01',
};

export const MOCK_ADMIN_INSTITUTIONS_USERS: InstitutionUser[] = [MOCK_ADMIN_INSTITUTIONS_USER];
