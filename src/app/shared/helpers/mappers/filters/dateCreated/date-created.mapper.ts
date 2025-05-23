import { DateCreated } from '@shared/entities/filters/dateCreated/date-created.entity';
import { IndexCardFilter } from '@shared/entities/filters/index-card-filter.entity';
import { IndexValueSearch } from '@shared/entities/filters/index-value-search.entity';

export function MapDateCreated(items: IndexValueSearch[]): DateCreated[] {
  const datesCreated: DateCreated[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find((p) => p.id === item.relationships.indexCard.data.id);
      datesCreated.push({
        value: (indexCard as IndexCardFilter).attributes.resourceMetadata.displayLabel[0]['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return datesCreated;
}
