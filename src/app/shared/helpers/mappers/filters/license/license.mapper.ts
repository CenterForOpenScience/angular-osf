import { LicenseFilter } from '@shared/entities/filters/license/license-filter.entity';
import { LicenseIndexCardFilter } from '@shared/entities/filters/license/license-index-card-filter.entity';
import { LicenseIndexValueSearch } from '@shared/entities/filters/license/license-index-value-search.entity';

export function MapLicenses(items: LicenseIndexValueSearch[]): LicenseFilter[] {
  const licenses: LicenseFilter[] = [];

  if (!items) {
    return [];
  }

  for (const item of items) {
    if (item.type === 'search-result') {
      const indexCard = items.find((p) => p.id === item.relationships.indexCard.data.id);
      licenses.push({
        id: (indexCard as LicenseIndexCardFilter).attributes.resourceMetadata?.['@id'],
        label: (indexCard as LicenseIndexCardFilter).attributes.resourceMetadata?.name?.[0]?.['@value'],
        count: item.attributes.cardSearchResultCount,
      });
    }
  }

  return licenses;
}
