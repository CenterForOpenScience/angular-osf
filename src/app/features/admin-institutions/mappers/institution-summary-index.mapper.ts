import {
  InstitutionIndexCardFilterJsonApi,
  InstitutionIndexValueSearchIncludedJsonApi,
  InstitutionSearchFilter,
  InstitutionSearchResultCountJsonApi,
} from '@osf/features/admin-institutions/models';

export function mapIndexCardResults(included: InstitutionIndexValueSearchIncludedJsonApi[]): InstitutionSearchFilter[] {
  const indexCardMap = included.reduce(
    (acc, item) => {
      if (item.type === 'index-card') {
        acc[item.id] = {
          id: item.id,
          label:
            (item as InstitutionIndexCardFilterJsonApi)?.attributes?.resourceMetadata?.displayLabel?.[0]?.['@value'] ||
            (item as InstitutionIndexCardFilterJsonApi)?.attributes?.resourceMetadata?.name?.[0]?.['@value'] ||
            item.id,
        };
      }
      return acc;
    },
    {} as Record<string, { id: string; label: string }>
  );

  return included.reduce((result, item) => {
    if (item.type === 'search-result') {
      const indexCardId = (item as InstitutionSearchResultCountJsonApi).relationships?.indexCard?.data?.id;
      const count = (item as InstitutionSearchResultCountJsonApi).attributes?.cardSearchResultCount ?? 0;
      const indexCard = indexCardMap[indexCardId];
      if (indexCard) {
        result.push({
          id: indexCard.id,
          label: indexCard.label,
          value: count,
        } as InstitutionSearchFilter);
      }
    }
    return result;
  }, [] as InstitutionSearchFilter[]);
}
