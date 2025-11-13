import { MetadataModel } from '@osf/features/metadata/models';
import { UserPermissions } from '@osf/shared/enums/user-permissions.enum';
import { IdentifierModel } from '@shared/models/identifiers/identifier.model';
import { Institution } from '@shared/models/institutions/institutions.models';

export const MOCK_PROJECT_METADATA: MetadataModel = {
  id: 'project-123',
  title: 'Test Project for Metadata',
  description:
    'This is a test project for metadata testing purposes. It contains various metadata fields to test the metadata component functionality.',
  tags: ['test', 'metadata', 'angular', 'osf'],
  resourceType: 'project',
  resourceLanguage: 'en',
  publicationDoi: '10.1234/test.doi',
  license: null,
  category: 'project',
  dateCreated: '2024-01-15T10:30:00.000Z',
  dateModified: '2024-01-20T14:45:00.000Z',
  identifiers: [
    {
      id: 'doi-1',
      type: 'doi',
      category: 'identifier',
      value: '10.1234/test.project',
    },
  ] as IdentifierModel[],
  affiliatedInstitutions: [
    {
      id: 'inst-1',
      type: 'institutions',
      name: 'Test University',
      description: 'A test university for mock data',
    },
  ] as Institution[],
  provider: 'osf',
  nodeLicense: {
    copyrightHolders: ['Test Author', 'Test University'],
    year: '2024',
  },
  public: true,
  currentUserPermissions: [UserPermissions.Write, UserPermissions.Read],
};
