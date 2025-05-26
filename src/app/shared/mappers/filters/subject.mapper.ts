import { IndexCardFilter } from '@osf/shared/models/filters/index-card-filter.model';
import { IndexValueSearch } from '@osf/shared/models/filters/index-value-search.model';
import { SubjectFilter } from '@osf/shared/models/filters/subject/subject-filter.model';

export function MapSubject(items: IndexValueSearch[]): SubjectFilter[] {
  const subjects: SubjectFilter[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find((p) => p.id === item.relationships.indexCard.data.id);
      subjects.push({
        id: (indexCard as IndexCardFilter).attributes.resourceMetadata?.['@id'],
        label: (indexCard as IndexCardFilter).attributes.resourceMetadata?.displayLabel?.[0]?.['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return subjects;
}
