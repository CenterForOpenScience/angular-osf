import { ApiData } from '@osf/shared/models';
import { DiscoverableFilter } from '@shared/models';

export interface RelatedPropertyPathAttributes {
  propertyPathKey: string;
  propertyPath: {
    '@id': string;
    displayLabel: {
      '@language': string;
      '@value': string;
    }[];
    description?: {
      '@language': string;
      '@value': string;
    }[];
    link?: {
      '@language': string;
      '@value': string;
    }[];
    linkText?: {
      '@language': string;
      '@value': string;
    }[];
    resourceType: {
      '@id': string;
    }[];
    shortFormLabel: {
      '@language': string;
      '@value': string;
    }[];
  }[];
  suggestedFilterOperator: string;
  cardSearchResultCount: number;
  osfmapPropertyPath: string[];
}

export interface AppliedFilter {
  propertyPathKey: string;
  propertyPathSet: {
    '@id': string;
    displayLabel?: {
      '@language': string;
      '@value': string;
    }[];
    description?: {
      '@language': string;
      '@value': string;
    }[];
    link?: {
      '@language': string;
      '@value': string;
    }[];
    linkText?: {
      '@language': string;
      '@value': string;
    }[];
    resourceType: {
      '@id': string;
    }[];
    shortFormLabel: {
      '@language': string;
      '@value': string;
    }[];
  }[][];
  filterValueSet: {
    '@id': string;
    displayLabel?: {
      '@language': string;
      '@value': string;
    }[];
    resourceType?: {
      '@id': string;
    }[];
    shortFormLabel?: {
      '@language': string;
      '@value': string;
    }[];
  }[];
  filterType: {
    '@id': string;
  };
}

export type RelatedPropertyPathItem = ApiData<RelatedPropertyPathAttributes, null, null, null>;

export function ReusableFilterMapper(item: RelatedPropertyPathItem): DiscoverableFilter {
  const key = item.attributes.propertyPathKey;
  const propertyPath = item.attributes.propertyPath?.[0];
  const label = propertyPath?.displayLabel?.[0]?.['@value'] ?? key;
  const operator = item.attributes.suggestedFilterOperator ?? 'any-of';
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
    resultCount: item.attributes.cardSearchResultCount,
    isLoading: false,
    isLoaded: false,
  };
}

export function AppliedFilterMapper(appliedFilter: AppliedFilter): DiscoverableFilter {
  const key = appliedFilter.propertyPathKey;
  const propertyPath = appliedFilter.propertyPathSet?.[0]?.[0];
  const label = propertyPath?.displayLabel?.[0]?.['@value'] ?? key;
  const operator = appliedFilter.filterType?.['@id']?.replace('trove:', '') ?? 'any-of';
  const description = propertyPath?.description?.[0]?.['@value'];
  const helpLink = propertyPath?.link?.[0]?.['@value'];
  const helpLinkText = propertyPath?.linkText?.[0]?.['@value'];

  const type: DiscoverableFilter['type'] = key === 'dateCreated' ? 'date' : key === 'creator' ? 'checkbox' : 'select';

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
  appliedFilters: AppliedFilter[] = [],
  availableFilters: RelatedPropertyPathItem[] = []
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
