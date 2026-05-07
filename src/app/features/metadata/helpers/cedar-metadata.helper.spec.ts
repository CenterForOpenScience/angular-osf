import { CedarTemplate } from '../models';

import { CedarMetadataHelper } from './cedar-metadata.helper';

const MOCK_TEMPLATE: CedarTemplate = {
  '@id': 'https://repo.metadatacenter.org/templates/test-id',
  '@type': 'https://schema.metadatacenter.org/core/Template',
  type: 'object',
  title: 'Test Template',
  description: 'Test',
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
};

describe('CedarMetadataHelper', () => {
  describe('ensureProperStructure', () => {
    it('should return an empty array for non-array input', () => {
      expect(CedarMetadataHelper.ensureProperStructure(null)).toEqual([]);
      expect(CedarMetadataHelper.ensureProperStructure('string')).toEqual([]);
      expect(CedarMetadataHelper.ensureProperStructure({})).toEqual([]);
    });

    it('should normalize array items to have @id, @type, rdfs:label', () => {
      const input = [{ '@id': 'id1', '@type': 'type1', 'rdfs:label': 'label1' }];
      expect(CedarMetadataHelper.ensureProperStructure(input)).toEqual([
        { '@id': 'id1', '@type': 'type1', 'rdfs:label': 'label1' },
      ]);
    });

    it('should fill missing properties with defaults', () => {
      const input = [{}];
      expect(CedarMetadataHelper.ensureProperStructure(input)).toEqual([
        { '@id': '', '@type': '', 'rdfs:label': null },
      ]);
    });
  });

  describe('buildCedarSystemMetadata', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2025-01-15T10:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should set @id to empty string', () => {
      const result = CedarMetadataHelper.buildCedarSystemMetadata(MOCK_TEMPLATE);
      expect(result['@id']).toBe('');
    });

    it('should set schema:isBasedOn to the template @id', () => {
      const result = CedarMetadataHelper.buildCedarSystemMetadata(MOCK_TEMPLATE);
      expect(result['schema:isBasedOn']).toBe('https://repo.metadatacenter.org/templates/test-id');
    });

    it('should set schema:name and schema:description to empty strings', () => {
      const result = CedarMetadataHelper.buildCedarSystemMetadata(MOCK_TEMPLATE);
      expect(result['schema:name']).toBe('');
      expect(result['schema:description']).toBe('');
    });

    it('should set pav:createdBy and oslc:modifiedBy to empty strings', () => {
      const result = CedarMetadataHelper.buildCedarSystemMetadata(MOCK_TEMPLATE);
      expect(result['pav:createdBy']).toBe('');
      expect(result['oslc:modifiedBy']).toBe('');
    });

    it('should set pav:createdOn and pav:lastUpdatedOn to the current timestamp', () => {
      const result = CedarMetadataHelper.buildCedarSystemMetadata(MOCK_TEMPLATE);
      expect(result['pav:createdOn']).toBe('2025-01-15T10:00:00.000Z');
      expect(result['pav:lastUpdatedOn']).toBe('2025-01-15T10:00:00.000Z');
    });

    it('should copy @context from the template', () => {
      const result = CedarMetadataHelper.buildCedarSystemMetadata(MOCK_TEMPLATE);
      expect(result['@context']).toEqual(MOCK_TEMPLATE['@context']);
    });

    it('should use empty object for @context when template has none', () => {
      const templateWithoutContext = { ...MOCK_TEMPLATE, '@context': undefined } as unknown as CedarTemplate;
      const result = CedarMetadataHelper.buildCedarSystemMetadata(templateWithoutContext);
      expect(result['@context']).toEqual({});
    });

    it('should use empty string for schema:isBasedOn when template @id is missing', () => {
      const templateWithoutId = { ...MOCK_TEMPLATE, '@id': undefined } as unknown as CedarTemplate;
      const result = CedarMetadataHelper.buildCedarSystemMetadata(templateWithoutId);
      expect(result['schema:isBasedOn']).toBe('');
    });
  });

  describe('buildEmptyMetadata', () => {
    it('should return an object with @context and LDbase-specific empty arrays', () => {
      const result = CedarMetadataHelper.buildEmptyMetadata();
      expect(result['@context']).toEqual({});
      expect(result['Constructs']).toEqual([]);
      expect(result['Assessments']).toEqual([]);
    });
  });

  describe('buildStructuredMetadata', () => {
    it('should return metadata as-is for keys not in the fix list', () => {
      const metadata = { customField: 'value' };
      expect(CedarMetadataHelper.buildStructuredMetadata(metadata)).toEqual({ customField: 'value' });
    });

    it('should normalize array fields in the fix list', () => {
      const metadata = { Constructs: [{ '@id': 'id1' }] };
      const result = CedarMetadataHelper.buildStructuredMetadata(metadata);
      expect(result['Constructs']).toEqual([{ '@id': 'id1', '@type': '', 'rdfs:label': null }]);
    });
  });
});
