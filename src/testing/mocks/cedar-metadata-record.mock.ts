import { CedarMetadataAttributes, CedarMetadataRecordData } from '@osf/features/metadata/models';

export const MOCK_CEDAR_METADATA_ATTRIBUTES: CedarMetadataAttributes = {
  '@context': {
    schema: 'http://schema.org/',
    pav: 'http://purl.org/pav/',
  },
  Constructs: [
    {
      '@id': 'http://example.com/construct/1',
      '@type': 'Construct',
      'rdfs:label': 'Test Construct',
      '@value': 'Construct Value',
    },
  ],
  Assessments: [
    {
      '@id': 'http://example.com/assessment/1',
      '@type': 'Assessment',
      'rdfs:label': 'Test Assessment',
      '@value': 'Assessment Value',
    },
  ],
  Organization: [
    {
      '@id': 'http://example.com/org/1',
      '@context': {
        OrganizationID: 'http://example.com/schema/OrganizationID',
        OrganizationName: 'http://example.com/schema/OrganizationName',
      },
      OrganizationID: {
        '@value': 'ORG-001',
      },
      OrganizationName: {
        '@value': 'Test Organization',
      },
    },
  ],
  'Project Name': {
    '@value': 'Test Project Name',
  },
  LDbaseWebsite: {
    '@value': 'https://example.com',
  },
  'Project Methods': [
    {
      '@id': 'http://example.com/method/1',
      '@type': 'Method',
      'rdfs:label': 'Test Method',
      '@value': 'Method Value',
    },
  ],
  'Participant Types': [
    {
      '@id': 'http://example.com/participant/1',
      '@type': 'ParticipantType',
      'rdfs:label': 'Students',
      '@value': 'Participant Value',
    },
  ],
  'Special Populations': [
    {
      '@id': 'http://example.com/population/1',
      '@type': 'SpecialPopulation',
      'rdfs:label': 'Learning Disabilities',
      '@value': 'Population Value',
    },
  ],
  'Developmental Design': {
    '@value': 'Longitudinal',
  },
  LDbaseProjectEndDate: {
    '@type': 'xsd:date',
    '@value': '2024-12-31',
  },
  'Educational Curricula': [
    {
      '@id': 'http://example.com/curriculum/1',
      '@type': 'Curriculum',
      'rdfs:label': 'Mathematics',
      '@value': 'Curriculum Value',
    },
  ],
  LDbaseInvestigatorORCID: [
    {
      '@id': 'http://orcid.org/0000-0001-2345-6789',
      '@type': 'ORCID',
      '@value': '0000-0001-2345-6789',
    },
  ],
  LDbaseProjectStartDates: {
    '@type': 'xsd:date',
    '@value': '2024-01-01',
  },
  'Educational Environments': {
    '@value': 'Classroom',
  },
  LDbaseProjectDescription: {
    '@value': 'This is a test project description for metadata testing purposes.',
  },
  LDbaseProjectContributors: [
    {
      '@value': 'John Doe',
    },
    {
      '@value': 'Jane Smith',
    },
  ],
};

export const MOCK_CEDAR_METADATA_RECORD_DATA: CedarMetadataRecordData = {
  id: 'record-1',
  type: 'cedar-metadata-records',
  attributes: {
    metadata: MOCK_CEDAR_METADATA_ATTRIBUTES,
    is_published: false,
  },
  embeds: {
    template: {
      data: {
        attributes: {
          active: true,
          cedar_id: 'cedar-template-123',
          schema_name: 'LDbase Project Metadata Schema',
        },
        id: 'template-1',
      },
    },
  },
  relationships: {
    template: {
      data: {
        id: 'template-1',
        type: 'cedar-metadata-templates',
      },
    },
    target: {
      data: {
        id: 'resource-1',
        type: 'nodes',
      },
    },
  },
};
