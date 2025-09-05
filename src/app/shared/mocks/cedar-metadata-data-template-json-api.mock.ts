import { CedarMetadataTemplate } from '@osf/features/metadata/models';

export const CEDAR_METADATA_DATA_TEMPLATE_JSON_API_MOCK: CedarMetadataTemplate = {
  id: 'template-1',
  type: 'cedar-metadata-templates',
  attributes: {
    schema_name: 'Test Schema',
    cedar_id: 'test-cedar-id',
    template: {
      '@id': 'http://example.com/template',
      '@type': 'https://schema.metadatacenter.org/core/Template',
      type: 'object',
      title: 'Test Template',
      description: 'A test template for metadata',
      $schema: 'http://json-schema.org/draft-04/schema#',
      '@context': {
        pav: 'http://purl.org/pav/',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        bibo: 'http://purl.org/ontology/bibo/',
        oslc: 'http://open-services.net/ns/core#',
        schema: 'http://schema.org/',
        'schema:name': { '@type': 'xsd:string' },
        'pav:createdBy': { '@type': 'xsd:string' },
        'pav:createdOn': { '@type': 'xsd:dateTime' },
        'oslc:modifiedBy': { '@type': 'xsd:string' },
        'pav:lastUpdatedOn': { '@type': 'xsd:dateTime' },
        'schema:description': { '@type': 'xsd:string' },
      },
      required: ['Project Name'],
      properties: {
        'Project Name': {
          type: 'string',
          title: 'Project Name',
        },
      },
      _ui: {
        order: ['Project Name'],
        propertyLabels: {
          'Project Name': 'Project Name',
        },
        propertyDescriptions: {
          'Project Name': 'The name of the project',
        },
      },
    },
  },
};
