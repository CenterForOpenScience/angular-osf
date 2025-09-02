import { AppliedFilter, RelatedPropertyPathAttributes } from '@shared/mappers';
import { ApiData, JsonApiResponse } from '@shared/models';

export type IndexCardSearchResponse = JsonApiResponse<
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
          prev: {
            href: string;
          };
        };
      };
    };
  },
  (
    | ApiData<{ resourceMetadata: SearchResourceMetadata }, null, null, null>
    | ApiData<RelatedPropertyPathAttributes, null, null, null>
  )[]
>;

export interface SearchResourceMetadata {
  '@id': string;
  accessService: MetadataField[];
  affiliation: MetadataField[];
  creator: ResourceCreator[];
  conformsTo: ConformsTo[];
  dateCopyrighted: { '@value': string }[];
  dateCreated: { '@value': string }[];
  dateModified: { '@value': string }[];
  description: { '@value': string }[];
  hasPreregisteredAnalysisPlan: { '@id': string }[];
  hasPreregisteredStudyDesign: { '@id': string }[];
  hostingInstitution: HostingInstitution[];
  identifier: { '@value': string }[];
  keyword: { '@value': string }[];
  publisher: MetadataField[];
  resourceNature: ResourceNature[];
  qualifiedAttribution: QualifiedAttribution[];
  resourceType: { '@id': string }[];
  title: { '@value': string }[];
  name: { '@value': string }[];
  fileName: { '@value': string }[];
  isPartOf: isPartOf[];
  isPartOfCollection: IsPartOfCollection[];
  rights: MetadataField[];
  statedConflictOfInterest: { '@id': string }[];
  hasDataResource: MetadataField[];
  hasAnalyticCodeResource: MetadataField[];
  hasMaterialsResource: MetadataField[];
  hasPapersResource: MetadataField[];
  hasSupplementalResource: MetadataField[];
}

interface ResourceCreator extends MetadataField {
  affiliation: MetadataField[];
  sameAs: { '@id': string }[];
}

interface HostingInstitution extends MetadataField {
  sameAs: MetadataField[];
}

interface QualifiedAttribution {
  agent: { '@id': string }[];
  hadRole: { '@id': string }[];
}

interface isPartOf extends MetadataField {
  creator: ResourceCreator[];
  dateCopyright: { '@value': string }[];
  dateCreated: { '@value': string }[];
  publisher: MetadataField[];
  rights: MetadataField[];
  rightHolder: { '@value': string }[];
  sameAs: { '@id': string }[];
  title: { '@value': string }[];
}

interface IsPartOfCollection {
  '@id': string;
  resourceNature: { '@id': string }[];
  title: { '@value': string }[];
}

interface ResourceNature {
  '@id': string;
  displayLabel: {
    '@language': string;
    '@value': string;
  }[];
}

interface ConformsTo {
  '@id': string;
  title: { '@value': string }[];
}

interface MetadataField {
  '@id': string;
  identifier: { '@value': string }[];
  name: { '@value': string }[];
  resourceType: { '@id': string }[];
}
