import { CardSearchFilterJsonApi, DiscoverableFilter, RelatedPropertyPathDataJsonApi } from '@shared/models';

export function ReusableFilterMapper(relatedPropertyPath: RelatedPropertyPathDataJsonApi): DiscoverableFilter {
  const key = relatedPropertyPath.attributes.propertyPathKey;
  const propertyPath = relatedPropertyPath.attributes.propertyPath?.[0];
  const label = propertyPath?.displayLabel?.[0]?.['@value'] ?? key;
  const operator = relatedPropertyPath.attributes.suggestedFilterOperator ?? 'any-of';
  const description = propertyPath?.description?.[0]?.['@value'];
  const helpLink = propertyPath?.link?.[0]?.['@value'];
  const helpLinkText = propertyPath?.linkText?.[0]?.['@value'];
  const type: DiscoverableFilter['type'] = key === 'dateCreated' ? 'date' : key === 'creator' ? 'checkbox' : 'select';

  return {
    key,
    label,
    type,
    operator,
    options: [],
    description,
    helpLink,
    helpLinkText,
    resultCount: relatedPropertyPath.attributes.cardSearchResultCount,
    isLoading: false,
    isLoaded: false,
  };
}

export function AppliedFilterMapper(cardSearchFilter: CardSearchFilterJsonApi): DiscoverableFilter {
  const key = cardSearchFilter.propertyPathKey;
  const propertyPath = cardSearchFilter.propertyPathSet?.[0]?.[0];
  const label = propertyPath?.displayLabel?.[0]?.['@value'] ?? key;
  const operator = cardSearchFilter.filterType?.['@id']?.replace('trove:', '') ?? 'any-of';
  const description = propertyPath?.description?.[0]?.['@value'];
  const helpLink = propertyPath?.link?.[0]?.['@value'];
  const helpLinkText = propertyPath?.linkText?.[0]?.['@value'];

  const type = key === 'dateCreated' ? 'date' : key === 'creator' ? 'checkbox' : 'select';

  return {
    key,
    label,
    type,
    operator,
    description,
    helpLink,
    helpLinkText,
    isLoading: false,
  };
}

export function CombinedFilterMapper(
  appliedFilters: CardSearchFilterJsonApi[] = [],
  availableFilters: RelatedPropertyPathDataJsonApi[] = []
): DiscoverableFilter[] {
  const filterMap = new Map<string, DiscoverableFilter>();

  appliedFilters.forEach((appliedFilter) => {
    const filter = AppliedFilterMapper(appliedFilter);
    filterMap.set(filter.key, filter);
  });

  availableFilters.forEach((availableFilter) => {
    const key = availableFilter.attributes.propertyPathKey;
    const existingFilter = filterMap.get(key);

    if (existingFilter) {
      existingFilter.resultCount = availableFilter.attributes.cardSearchResultCount;
      if (!existingFilter.description) {
        existingFilter.description = availableFilter.attributes.propertyPath?.[0]?.description?.[0]?.['@value'];
      }
      if (!existingFilter.helpLink) {
        existingFilter.helpLink = availableFilter.attributes.propertyPath?.[0]?.link?.[0]?.['@value'];
      }
      if (!existingFilter.helpLinkText) {
        existingFilter.helpLinkText = availableFilter.attributes.propertyPath?.[0]?.linkText?.[0]?.['@value'];
      }
    } else {
      const filter = ReusableFilterMapper(availableFilter);
      filterMap.set(filter.key, filter);
    }
  });

  return Array.from(filterMap.values());
}
