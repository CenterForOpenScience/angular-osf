import { ResourceTypeFilter } from '@osf/shared/models/filters/resource-type/resource-type.model';
import { ResourceTypeIndexCardFilter } from '@osf/shared/models/filters/resource-type/resource-type-index-card-filter.model';
import { ResourceTypeIndexValueSearch } from '@osf/shared/models/filters/resource-type/resource-type-index-value-search.model';

export function MapResourceType(items: ResourceTypeIndexValueSearch[]): ResourceTypeFilter[] {
  const resourceTypes: ResourceTypeFilter[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find((p) => p.id === item.relationships.indexCard.data.id);
      resourceTypes.push({
        id: (indexCard as ResourceTypeIndexCardFilter).attributes.resourceMetadata?.['@id'],
        label: (indexCard as ResourceTypeIndexCardFilter).attributes.resourceMetadata?.displayLabel?.[0]?.['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return resourceTypes;
}
