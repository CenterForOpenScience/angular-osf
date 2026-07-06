import { Embed } from '@osf/shared/models/common/json-api/embeds.model';
import { ToOneRelData } from '@osf/shared/models/common/json-api/relationships.model';
import { JsonApiResource } from '@osf/shared/models/common/json-api/resource.model';
import { DataResponse, ListResponse } from '@osf/shared/models/common/json-api/responses.model';

export type CedarMetadataTemplateJsonApi = ListResponse<CedarMetadataDataTemplateJsonApi>;
export type CedarMetadataRecordJsonApi = ListResponse<CedarMetadataRecordDataJsonApi>;
export type CedarMetadataRecord = DataResponse<CedarMetadataRecordDataJsonApi>;

export interface CedarRecordDataBinding {
  id: string;
  data: CedarMetadataAttributes;
  isPublished: boolean;
}

export type CedarMetadataDataTemplateJsonApi = JsonApiResource<
  'cedar-metadata-templates',
  CedarMetadataTemplateAttributesJsonApi
>;

interface CedarMetadataTemplateAttributesJsonApi {
  active: boolean;
  cedar_id: string;
  schema_name: string;
  template: CedarTemplate;
  is_for_collections: boolean;
}

export const CEDAR_TEMPLATE_FIELD_TYPE = 'https://schema.metadatacenter.org/core/TemplateField';
export const CEDAR_PROPERTIES_BASE_IRI = 'https://schema.metadatacenter.org/properties/';

export interface CedarTemplateField {
  '@type': string;
  _valueConstraints?: {
    literals?: { label: string }[];
    multipleChoice?: boolean;
    requiredValue?: boolean;
  };
}

export interface CedarTemplateContextSchema {
  properties: Record<string, { enum?: string[] }>;
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

interface CedarTemplateContext {
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

interface CedarFieldItem extends Record<string, unknown> {
  '@id'?: string;
  '@type'?: string;
  'rdfs:label'?: string | null;
  '@value'?: string;
}

export interface CedarMetadataRecordDataJsonApi {
  id?: string;
  type?: string;
  attributes: CedarMetadataRecordAttributes;
  embeds?: {
    template: Embed<CedarMetadataDataTemplateJsonApi>;
  };
  relationships: {
    template: ToOneRelData;
    target: ToOneRelData;
  };
}

interface CedarMetadataRecordAttributes {
  metadata: CedarMetadataAttributes;
  is_published: boolean;
}
