import { ResourceFiltersStateModel } from '@shared/components/resources/resource-filters/store';

export function addFiltersParams(
  filters: ResourceFiltersStateModel,
): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters.creator.value) {
    params['cardSearchFilter[creator][]'] = filters.creator.value;
  }
  if (filters.dateCreated.value) {
    params['cardSearchFilter[dateCreated][]'] = filters.dateCreated.value;
  }
  if (filters.subject.value) {
    params['cardSearchFilter[subject][]'] = filters.subject.value;
  }
  if (filters.funder.value) {
    params['cardSearchFilter[funder][]'] = filters.funder.value;
  }
  if (filters.license.value) {
    params['cardSearchFilter[rights][]'] = filters.license.value;
  }
  if (filters.resourceType.value) {
    params['cardSearchFilter[resourceNature][]'] = filters.resourceType.value;
  }
  if (filters.institution.value) {
    params['cardSearchFilter[affiliation][]'] = filters.institution.value;
  }
  if (filters.provider.value) {
    params['cardSearchFilter[publisher][]'] = filters.provider.value;
  }
  if (filters.partOfCollection.value) {
    params['cardSearchFilter[isPartOfCollection][]'] =
      filters.partOfCollection.value;
  }

  return params;
}
