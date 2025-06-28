export enum ReusableFilterType {
  AFFILIATION = 'affiliation',
  ACCESS_SERVICE = 'accessService',
  RESOURCE_TYPE = 'resourceType',
  SUBJECT = 'subject',
  FUNDER = 'funder',
  DATE_CREATED = 'dateCreated',
  CREATOR = 'creator',
  IS_PART_OF_COLLECTION = 'isPartOfCollection',
  PUBLISHER = 'publisher',
  RIGHTS = 'rights',
  RESOURCE_NATURE = 'resourceNature',
}

// Optional: Component mapping if needed for dynamic component loading
export const REUSABLE_FILTER_COMPONENTS: Record<ReusableFilterType, string> = {
  [ReusableFilterType.AFFILIATION]: 'osf-reusable-institution-filter',
  [ReusableFilterType.ACCESS_SERVICE]: 'osf-reusable-access-service-filter',
  [ReusableFilterType.RESOURCE_TYPE]: 'osf-reusable-resource-type-filter',
  [ReusableFilterType.SUBJECT]: 'osf-reusable-subject-filter',
  [ReusableFilterType.FUNDER]: 'osf-reusable-funder-filter',
  [ReusableFilterType.DATE_CREATED]: 'osf-reusable-date-created-filter',
  [ReusableFilterType.CREATOR]: 'osf-reusable-creators-filter',
  [ReusableFilterType.IS_PART_OF_COLLECTION]: 'osf-reusable-part-of-collection-filter',
  [ReusableFilterType.PUBLISHER]: 'osf-reusable-provider-filter',
  [ReusableFilterType.RIGHTS]: 'osf-reusable-license-filter',
  [ReusableFilterType.RESOURCE_NATURE]: 'osf-reusable-resource-nature-filter',
};
