import { DateCreated } from '@shared/components/resources/resource-filters/models/dateCreated/date-created.entity';
import { IndexValueSearch } from '@shared/components/resources/resource-filters/models/index-value-search.entity';
import { IndexCardFilter } from '@shared/components/resources/resource-filters/models/index-card-filter.entity';

export function MapDateCreated(items: IndexValueSearch[]): DateCreated[] {
  const datesCreated: DateCreated[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find(
        (p) => p.id === item.relationships.indexCard.data.id,
      );
      datesCreated.push({
        value: (indexCard as IndexCardFilter).attributes.resourceMetadata
          .displayLabel[0]['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return datesCreated;
}
