import { PartOfCollectionFilter } from '@osf/shared/models/filters/part-of-collection/part-of-collection-filter.model';
import { PartOfCollectionIndexCardFilter } from '@osf/shared/models/filters/part-of-collection/part-of-collection-index-card-filter.model';
import { PartOfCollectionIndexValueSearch } from '@osf/shared/models/filters/part-of-collection/part-of-collection-index-value-search.model';

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
