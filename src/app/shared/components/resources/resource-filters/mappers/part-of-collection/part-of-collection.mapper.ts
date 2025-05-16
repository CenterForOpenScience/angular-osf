import { PartOfCollectionFilter } from '@shared/components/resources/resource-filters/models/part-of-collection/part-of-collection-filter.entity';
import { PartOfCollectionIndexCardFilter } from '@shared/components/resources/resource-filters/models/part-of-collection/part-of-collection-index-card-filter.entity';
import { PartOfCollectionIndexValueSearch } from '@shared/components/resources/resource-filters/models/part-of-collection/part-of-collection-index-value-search.entity';

export function MapPartOfCollections(items: PartOfCollectionIndexValueSearch[]): PartOfCollectionFilter[] {
  const partOfCollections: PartOfCollectionFilter[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find((p) => p.id === item.relationships.indexCard.data.id);
      partOfCollections.push({
        id: (indexCard as PartOfCollectionIndexCardFilter).attributes.resourceMetadata?.['@id'],
        label: (indexCard as PartOfCollectionIndexCardFilter).attributes.resourceMetadata?.title?.[0]?.['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return partOfCollections;
}
