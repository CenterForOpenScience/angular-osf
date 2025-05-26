import { MetadataField } from '@osf/shared/models';

export interface ResourceItem {
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

export interface ResourceCreator extends MetadataField {
  affiliation: MetadataField[];
  sameAs: { '@id': string }[];
}

export interface HostingInstitution extends MetadataField {
  sameAs: MetadataField[];
}

export interface QualifiedAttribution {
  agent: { '@id': string }[];
  hadRole: { '@id': string }[];
}

export interface isPartOf extends MetadataField {
  creator: ResourceCreator[];
  dateCopyright: { '@value': string }[];
  dateCreated: { '@value': string }[];
  publisher: MetadataField[];
  rights: MetadataField[];
  rightHolder: { '@value': string }[];
  sameAs: { '@id': string }[];
  title: { '@value': string }[];
}

export interface IsPartOfCollection {
  '@id': string;
  resourceNature: { '@id': string }[];
  title: { '@value': string }[];
}

export interface ResourceNature {
  '@id': string;
  displayLabel: {
    '@language': string;
    '@value': string;
  }[];
}

export interface ConformsTo {
  '@id': string;
  title: { '@value': string }[];
}
