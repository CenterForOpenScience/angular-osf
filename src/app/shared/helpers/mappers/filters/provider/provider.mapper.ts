import { ProviderFilter } from '@shared/entities/filters/provider/provider-filter.entity';
import { ProviderIndexCardFilter } from '@shared/entities/filters/provider/provider-index-card-filter.entity';
import { ProviderIndexValueSearch } from '@shared/entities/filters/provider/provider-index-value-search.entity';

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
