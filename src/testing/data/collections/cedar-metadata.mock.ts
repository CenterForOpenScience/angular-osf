import { CedarMetadataDataTemplateJsonApi, CedarMetadataRecordData } from '@osf/features/metadata/models';
import { CollectionSubmissionReviewState } from '@osf/shared/enums/collection-submission-review-state.enum';
import { CollectionSubmission } from '@osf/shared/models/collections/collections.model';

export const MOCK_CEDAR_TEMPLATE: CedarMetadataDataTemplateJsonApi = {
  id: 'template-1',
  type: 'cedar-metadata-templates',
  attributes: {
    schema_name: 'Test Template',
    cedar_id: 'cedar-1',
    template: {
      '@id': 'https://repo.metadatacenter.org/templates/1',
      '@type': 'https://schema.metadatacenter.org/core/Template',
      type: 'object',
      title: 'Test',
      description: 'Test template',
      $schema: 'http://json-schema.org/draft-04/schema#',
      '@context': {
        pav: 'http://purl.org/pav/',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        bibo: 'http://purl.org/ontology/bibo/',
        oslc: 'http://open-services.net/ns/core#',
        schema: 'http://schema.org/',
        'schema:name': { '@type': 'xsd:string' },
        'pav:createdBy': { '@type': '@id' },
        'pav:createdOn': { '@type': 'xsd:dateTime' },
        'oslc:modifiedBy': { '@type': '@id' },
        'pav:lastUpdatedOn': { '@type': 'xsd:dateTime' },
        'schema:description': { '@type': 'xsd:string' },
      },
      required: [],
      properties: {},
      _ui: { order: [], propertyLabels: {}, propertyDescriptions: {} },
    },
  },
};

export const MOCK_CEDAR_RECORD: CedarMetadataRecordData = {
  id: 'record-1',
  attributes: {
    metadata: { field: 'value' } as unknown as CedarMetadataRecordData['attributes']['metadata'],
    is_published: true,
  },
  relationships: {
    template: { data: { type: 'cedar-metadata-templates', id: 'template-1' } },
    target: { data: { type: 'nodes', id: 'node-1' } },
  },
};

export const MOCK_CEDAR_SUBMISSION: CollectionSubmission = {
  id: '1',
  type: 'collection-submission',
  collectionTitle: 'Test Collection',
  collectionId: 'collection-123',
  reviewsState: CollectionSubmissionReviewState.Pending,
  collectedType: 'preprint',
  status: 'pending',
  volume: '1',
  issue: '1',
  programArea: 'Science',
  schoolType: 'University',
  studyDesign: 'Experimental',
  dataType: 'Quantitative',
  disease: 'Cancer',
  gradeLevels: 'Graduate',
  requiredMetadataTemplateId: 'template-1',
};
