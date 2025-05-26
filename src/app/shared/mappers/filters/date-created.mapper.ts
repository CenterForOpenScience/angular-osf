import { DateCreated } from '@osf/shared/models/filters/date-created/date-created.model';
import { IndexCardFilter } from '@osf/shared/models/filters/index-card-filter.model';
import { IndexValueSearch } from '@osf/shared/models/filters/index-value-search.model';

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
