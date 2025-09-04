import { AppliedFilter, RelatedPropertyPathAttributes } from '@shared/mappers';
import { ApiData, JsonApiResponse } from '@shared/models';

export type IndexCardSearchResponseJsonApi = JsonApiResponse<
  {
    attributes: {
      totalResultCount: number;
      cardSearchFilter?: AppliedFilter[];
    };
    relationships: {
      searchResultPage: {
        links: {
          first: {
            href: string;
          };
          next: {
            href: string;
          };
          prev?: {
            href: string;
          };
        };
      };
    };
  },
  (IndexCardDataJsonApi | ApiData<RelatedPropertyPathAttributes, null, null, null>)[]
>;

export type IndexCardDataJsonApi = ApiData<IndexCardAttributesJsonApi, null, null, null>;

interface IndexCardAttributesJsonApi {
  resourceIdentifier: string[];
  resourceMetadata: ResourceMetadataJsonApi;
}

interface ResourceMetadataJsonApi {
  '@id': string;
  resourceType: { '@id': string }[];
  name: { '@value': string }[];
  title: { '@value': string }[];
  fileName: { '@value': string }[];
  description: { '@value': string }[];

  dateCreated: { '@value': string }[];
  dateModified: { '@value': string }[];
  dateWithdrawn: { '@value': string }[];

  creator: MetadataField[];
  hasVersion: MetadataField[];
  identifier: { '@value': string }[];
  publisher: MetadataField[];
  rights: MetadataField[];
  language: { '@value': string }[];
  statedConflictOfInterest: { '@value': string }[];
  resourceNature: ResourceNature[];
  isPartOfCollection: MetadataField[];
  funder: MetadataField[];
  affiliation: MetadataField[];
  qualifiedAttribution: QualifiedAttribution[];
  isPartOf: MetadataField[];
  isContainedBy: IsContainedBy[];
  conformsTo: MetadataField[];
  hasPreregisteredAnalysisPlan: { '@id': string }[];
  hasPreregisteredStudyDesign: { '@id': string }[];
  hasDataResource: MetadataField[];
  hasAnalyticCodeResource: MetadataField[];
  hasMaterialsResource: MetadataField[];
  hasPapersResource: MetadataField[];
  hasSupplementalResource: MetadataField[];
}

interface MetadataField {
  '@id': string;
  identifier: { '@value': string }[];
  name: { '@value': string }[];
  resourceType: { '@id': string }[];
  title: { '@value': string }[];
}

interface QualifiedAttribution {
  agent: { '@id': string }[];
  hadRole: { '@id': string }[];
  'osf:order': { '@value': string }[];
}

interface IsContainedBy extends MetadataField {
  funder: MetadataField[];
  creator: MetadataField[];
  rights: MetadataField[];
  qualifiedAttribution: QualifiedAttribution[];
}

interface ResourceNature {
  '@id': string;
  displayLabel: {
    '@language': string;
    '@value': string;
  }[];
}
