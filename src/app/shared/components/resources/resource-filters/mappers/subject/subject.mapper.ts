import { IndexValueSearch } from '@shared/components/resources/resource-filters/models/index-value-search.entity';
import { SubjectFilter } from '@shared/components/resources/resource-filters/models/subject/subject-filter.entity';
import { IndexCardFilter } from '@shared/components/resources/resource-filters/models/index-card-filter.entity';

export function MapSubject(items: IndexValueSearch[]): SubjectFilter[] {
  const subjects: SubjectFilter[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find(
        (p) => p.id === item.relationships.indexCard.data.id,
      );
      subjects.push({
        id: (indexCard as IndexCardFilter).attributes.resourceMetadata?.['@id'],
        label: (indexCard as IndexCardFilter).attributes.resourceMetadata
          ?.displayLabel?.[0]?.['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return subjects;
}
