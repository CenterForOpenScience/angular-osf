import { PaginationLinksJsonApi } from '@osf/core/models';

export interface CedarMetadataDataTemplateJsonApi {
  id: string;
  type: 'cedar-metadata-templates';
  attributes: {
    schema_name: string;
    cedar_id: string;
    template: CedarTemplate;
  };
}

export interface CedarTemplate {
  '@id': string;
  '@type': string;
  type: string;
  title: string;
  description: string;
  $schema: string;
  '@context': CedarTemplateContext;
  required: string[];
  properties: Record<string, unknown>;
  _ui: {
    order: string[];
    propertyLabels: Record<string, string>;
    propertyDescriptions: Record<string, string>;
  };
}

export interface CedarTemplateContext {
  pav: string;
  xsd: string;
  bibo: string;
  oslc: string;
  schema: string;
  'schema:name': {
    '@type': string;
  };
  'pav:createdBy': {
    '@type': string;
  };
  'pav:createdOn': {
    '@type': string;
  };
  'oslc:modifiedBy': {
    '@type': string;
  };
  'pav:lastUpdatedOn': {
    '@type': string;
  };
  'schema:description': {
    '@type': string;
  };
}

export interface CedarMetadataTemplate {
  id: string;
  type: 'cedar-metadata-templates';
  attributes: {
    schema_name: string;
    cedar_id: string;
    template: CedarTemplate;
  };
}

export interface CedarTemplate {
  '@id': string;
  '@type': string;
  type: string;
  title: string;
  $schema: string;
  '@context': CedarTemplateContext;
  required: string[];
  properties: Record<string, unknown>;
  _ui: {
    order: string[];
    propertyLabels: Record<string, string>;
    propertyDescriptions: Record<string, string>;
  };
}

export interface CedarTemplateContext {
  pav: string;
  xsd: string;
  bibo: string;
  oslc: string;
  schema: string;
  'schema:name': {
    '@type': string;
  };
  'pav:createdBy': {
    '@type': string;
  };
  'pav:createdOn': {
    '@type': string;
  };
  'oslc:modifiedBy': {
    '@type': string;
  };
  'pav:lastUpdatedOn': {
    '@type': string;
  };
  'schema:description': {
    '@type': string;
  };
}

export interface CedarMetadataTemplateJsonApi {
  data: CedarMetadataDataTemplateJsonApi[];
  links: PaginationLinksJsonApi;
}

export interface FieldSchema {
  type?: string;
  format?: string;
  title?: string;
  description?: string;
  maxLength?: number;
  items?: FieldSchema;
  properties?: Record<string, FieldSchema>;
  required?: string[];
  _ui?: {
    inputType?: string;
    order?: string[];
    propertyLabels?: Record<string, string>;
    propertyDescriptions?: Record<string, string>;
  };
  'schema:name'?: string;
  'schema:description'?: string;
  '@id': string;
}

export interface CedarFieldItem extends Record<string, unknown> {
  '@id'?: string;
  '@type'?: string;
  'rdfs:label'?: string | null;
  '@value'?: string;
}

export interface CedarMetadataAttributes {
  '@context': Record<string, unknown>;
  Constructs: CedarFieldItem[];
  Assessments: CedarFieldItem[];
  Organization: {
    '@id': string;
    '@context': {
      OrganizationID: string;
      OrganizationName: string;
    };
    OrganizationID: Record<string, unknown>;
    OrganizationName: {
      '@value': string;
    };
  }[];
  'Project Name': {
    '@value': string;
  };
  LDbaseWebsite: Record<string, unknown>;
  'Project Methods': CedarFieldItem[];
  'Participant Types': CedarFieldItem[];
  'Special Populations': CedarFieldItem[];
  'Developmental Design': Record<string, unknown>;
  LDbaseProjectEndDate: {
    '@type': string;
    '@value': string;
  };
  'Educational Curricula': CedarFieldItem[];
  LDbaseInvestigatorORCID: CedarFieldItem[];
  LDbaseProjectStartDates: {
    '@type': string;
    '@value': string;
  };
  'Educational Environments': Record<string, unknown>;
  LDbaseProjectDescription: {
    '@value': string;
  };

  [key: string]: unknown;

  LDbaseProjectContributors: {
    '@value': string;
  }[];
}

export interface CedarMetadataRecord {
  data: CedarMetadataRecordData;
}

export interface CedarRecordDataBinding {
  data: CedarMetadataAttributes;
  id: string;
}

export interface CedarMetadataRecordJsonApi {
  data: CedarMetadataRecordData[];
  links: PaginationLinksJsonApi;
  meta: {
    per_page: number;
    total: number;
    version: string;
  };
}

export interface CedarMetadataRecordData {
  id?: string;
  attributes: CedarMetadataRecordAttributes;
  embeds?: {
    template: {
      data: {
        attributes: {
          active: boolean;
          cedar_id: string;
          schema_name: string;
        };
        id: string;
      };
    };
  };
  relationships: {
    template: {
      data: {
        type: string;
        id: string;
      };
    };
    target: {
      data: {
        type: 'nodes';
        id: string;
      };
    };
  };
  type?: string;
}

export interface CedarMetadataRecordAttributes {
  metadata: CedarMetadataAttributes;
  is_published: boolean;
}
