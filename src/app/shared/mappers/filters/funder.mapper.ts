import { FunderFilter } from '@osf/shared/models/filters/funder/funder-filter.model';
import { FunderIndexCardFilter } from '@osf/shared/models/filters/funder/funder-index-card-filter.model';
import { FunderIndexValueSearch } from '@osf/shared/models/filters/funder/funder-index-value-search.model';

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
