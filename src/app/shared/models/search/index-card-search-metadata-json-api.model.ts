export interface ResourceMetadataJsonApi {
  '@id': string;
  resourceType: IdNodeJsonApi[];
  name: ValueNodeJsonApi[];
  title: ValueNodeJsonApi[];
  fileName: ValueNodeJsonApi[];
  description: ValueNodeJsonApi[];
  dateCreated: ValueNodeJsonApi[];
  dateModified: ValueNodeJsonApi[];
  dateWithdrawn: ValueNodeJsonApi[];
  creator: CreatorJsonApi[];
  hasVersion: MetadataFieldJsonApi[];
  identifier: ValueNodeJsonApi[];
  publisher: MetadataFieldJsonApi[];
  rights: MetadataFieldJsonApi[];
  language: ValueNodeJsonApi[];
  statedConflictOfInterest: ValueNodeJsonApi[];
  resourceNature: ResourceNatureJsonApi[];
  isPartOfCollection: MetadataFieldJsonApi[];
  storageByteCount: ValueNodeJsonApi[];
  storageRegion: { prefLabel: ValueNodeJsonApi[] }[];
  usage: UsageJsonApi;
  hasOsfAddon: { prefLabel: ValueNodeJsonApi[] }[];
  funder: MetadataFieldJsonApi[];
  affiliation: MetadataFieldJsonApi[];
  qualifiedAttribution: QualifiedAttributionJsonApi[];
  isPartOf: MetadataFieldJsonApi[];
  isContainedBy: IsContainedByJsonApi[];
  conformsTo: MetadataFieldJsonApi[];
  hasPreregisteredAnalysisPlan: IdNodeJsonApi[];
  hasPreregisteredStudyDesign: IdNodeJsonApi[];
  hasDataResource: MetadataFieldJsonApi[];
  hasAnalyticCodeResource: MetadataFieldJsonApi[];
  hasMaterialsResource: MetadataFieldJsonApi[];
  hasPapersResource: MetadataFieldJsonApi[];
  hasSupplementalResource: MetadataFieldJsonApi[];
}

export interface RelatedPropertyPathJsonApi {
  '@id': string;
  displayLabel: LanguageValueNodeJsonApi[];
  description?: LanguageValueNodeJsonApi[];
  link?: LanguageValueNodeJsonApi[];
  linkText?: LanguageValueNodeJsonApi[];
  resourceType: IdNodeJsonApi[];
  shortFormLabel: LanguageValueNodeJsonApi[];
}

export interface MatchEvidencePropertyPathJsonApi {
  displayLabel: LanguageValueNodeJsonApi[];
}

interface ValueNodeJsonApi {
  '@value': string;
}

interface LanguageValueNodeJsonApi extends ValueNodeJsonApi {
  '@language': string;
}

export interface IdNodeJsonApi {
  '@id': string;
}

interface MetadataFieldJsonApi {
  '@id': string;
  identifier: ValueNodeJsonApi[];
  name: ValueNodeJsonApi[];
  resourceType: IdNodeJsonApi[];
  title: ValueNodeJsonApi[];
}

interface QualifiedAttributionJsonApi {
  agent: IdNodeJsonApi[];
  hadRole: IdNodeJsonApi[];
  'osf:order': ValueNodeJsonApi[];
}

interface UsageJsonApi {
  viewCount: ValueNodeJsonApi[];
  downloadCount: ValueNodeJsonApi[];
}

interface CreatorJsonApi extends MetadataFieldJsonApi {
  affiliation: MetadataFieldJsonApi[];
}

interface IsContainedByJsonApi extends MetadataFieldJsonApi {
  funder: MetadataFieldJsonApi[];
  creator: CreatorJsonApi[];
  rights: MetadataFieldJsonApi[];
  qualifiedAttribution: QualifiedAttributionJsonApi[];
}

interface ResourceNatureJsonApi {
  '@id': string;
  displayLabel: LanguageValueNodeJsonApi[];
}
