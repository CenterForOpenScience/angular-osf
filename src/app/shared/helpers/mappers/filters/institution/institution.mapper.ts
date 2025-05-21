import { InstitutionFilter } from '@shared/entities/filters/institution/institution-filter.entity';
import { InstitutionIndexCardFilter } from '@shared/entities/filters/institution/institution-index-card-filter.entity';
import { InstitutionIndexValueSearch } from '@shared/entities/filters/institution/institution-index-value-search.entity';

export function MapInstitutions(items: InstitutionIndexValueSearch[]): InstitutionFilter[] {
  const institutions: InstitutionFilter[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find((p) => p.id === item.relationships.indexCard.data.id);
      institutions.push({
        id: (indexCard as InstitutionIndexCardFilter).attributes.resourceMetadata?.['@id'],
        label: (indexCard as InstitutionIndexCardFilter).attributes.resourceMetadata?.name?.[0]?.['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return institutions;
}
