import { FunderFilter } from '@shared/components/resources/resource-filters/models/funder/funder-filter.entity';
import { FunderIndexCardFilter } from '@shared/components/resources/resource-filters/models/funder/funder-index-card-filter.entity';
import { FunderIndexValueSearch } from '@shared/components/resources/resource-filters/models/funder/funder-index-value-search.entity';

export function MapFunders(items: FunderIndexValueSearch[]): FunderFilter[] {
  const funders: FunderFilter[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find((p) => p.id === item.relationships.indexCard.data.id);
      funders.push({
        id: (indexCard as FunderIndexCardFilter).attributes.resourceMetadata?.['@id'],
        label: (indexCard as FunderIndexCardFilter).attributes.resourceMetadata?.name?.[0]?.['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return funders;
}
