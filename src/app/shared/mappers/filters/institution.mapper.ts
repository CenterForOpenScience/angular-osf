import { InstitutionFilter } from '@osf/shared/models/filters/institution/institution-filter.model';
import { InstitutionIndexCardFilter } from '@osf/shared/models/filters/institution/institution-index-card-filter.model';
import { InstitutionIndexValueSearch } from '@osf/shared/models/filters/institution/institution-index-value-search.model';

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
