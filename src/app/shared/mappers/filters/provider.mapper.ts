import { ProviderFilter } from '@osf/shared/models/filters/provider/provider-filter.model';
import { ProviderIndexCardFilter } from '@osf/shared/models/filters/provider/provider-index-card-filter.model';
import { ProviderIndexValueSearch } from '@osf/shared/models/filters/provider/provider-index-value-search.model';

export function MapProviders(items: ProviderIndexValueSearch[]): ProviderFilter[] {
  const providers: ProviderFilter[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find((p) => p.id === item.relationships.indexCard.data.id);
      providers.push({
        id: (indexCard as ProviderIndexCardFilter).attributes.resourceMetadata?.['@id'],
        label: (indexCard as ProviderIndexCardFilter).attributes.resourceMetadata?.name?.[0]?.['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return providers;
}
